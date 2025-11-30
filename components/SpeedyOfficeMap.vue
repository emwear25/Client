```html
<template>
  <div class="speedy-office-map">
    <!-- Search Controls (always visible) -->
    <div class="map-controls">
      <!-- City Search -->
      <div class="search-input-wrapper">
        <label for="city-search">🏙️ Изберете населено място:</label>
        <input
          id="city-search"
          v-model="citySearchQuery"
          type="text"
          placeholder="Кликнете за избор на град..."
          class="search-input"
          @focus="showCitySuggestions = true"
          @blur="hideCitySuggestions"
        />
        <div v-if="showCitySuggestions && filteredCities.length > 0" class="suggestions-dropdown">
          <div
            v-for="city in filteredCities"
            :key="city.cityName"
            class="suggestion-item"
            @mousedown.prevent="selectCity(city)"
          >
            <strong>{{ city.cityName }}</strong>
            <span class="office-count">{{ city.offices.length }} офиса</span>
          </div>
        </div>
      </div>

      <!-- Office Search -->
      <div class="search-input-wrapper">
        <label for="office-search">🏢 Изберете офис{{ selectedCityName ? ` в ${selectedCityName}` : '' }}:</label>
        <input
          id="office-search"
          v-model="officeSearchQuery"
          type="text"
          :placeholder="selectedCityName ? `Кликнете за избор на офис в ${selectedCityName}...` : 'Първо изберете град...'"
          class="search-input"
          :disabled="!selectedCityName"
          @focus="showOfficeSuggestions = true"
          @blur="hideOfficeSuggestions"
        />
        <div v-if="showOfficeSuggestions && filteredOfficesForSearch.length > 0" class="suggestions-dropdown">
          <div
            v-for="office in filteredOfficesForSearch"
            :key="office.id"
            class="suggestion-item"
            @mousedown.prevent="selectOfficeFromDropdown(office)"
          >
            <strong>{{ office.name }}</strong>
            <div class="office-details">
              <span>{{ office.address.city.name }}</span>
              <span v-if="office.isAPS || office.isMPS" class="badge">📦 Автомат</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Map Container (hidden after confirmation) -->
    <div v-show="!isConfirmed" class="map-wrapper">
      <!-- Instructional Overlay (shown when no city selected) -->
      <div v-if="!selectedCityName" class="map-overlay">
        <div class="overlay-message">
          <div class="overlay-icon">📍</div>
          <h3>Изберете града/населеното място от списъка</h3>
          <p>за да видите пунктовете на картата</p>
        </div>
      </div>
      
      <div ref="mapContainer" class="map-container"></div>
    </div>
    
    <!-- Selected Office Card (shown after confirmation) -->
    <div v-show="isConfirmed" class="selected-office-card">
      <div class="success-badge">✓ Избран офис</div>
      <h3>{{ selectedOffice?.name }}</h3>
      <p class="office-address">{{ selectedOffice?.address.fullAddress }}</p>
      <p class="office-city">{{ selectedOffice?.address.city.name }}</p>
      <button @click="changeOffice" class="change-office-btn">
        ✏️ Промени адрес
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed, nextTick } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

interface Office {
  id: number
  name: string
  type: 'OFFICE' | 'APT' // Speedy uses type instead of isAPS/isMPS
  address: {
    city: {
      id: number
      name: string
      postCode?: string
    }
    siteId?: number
    siteName?: string
    fullAddressString?: string
    fullAddress?: string // For compatibility
    x?: number // longitude
    y?: number // latitude
    location?: { // For compatibility with Econt structure
      latitude: number
      longitude: number
    }
  }
  workingTimeFrom?: string
  workingTimeTo?: string
  phones?: string[]
  // Computed properties for compatibility
  isAPS?: boolean
  isMPS?: boolean
}

interface CityGroup {
  cityName: string
  cityId: number
  offices: Office[]
  centerLat: number
  centerLng: number
}

const props = defineProps<{
  officeType?: 'office' | 'aps' | 'all'
  initialCity?: string
}>()

const emit = defineEmits<{
  (e: 'office-selected', office: Office): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const cityMarkers = ref<L.Marker[]>([])
const officeMarkers = ref<L.Marker[]>([])
const markerClusterGroup = ref<any>(null)
const offices = ref<Office[]>([])
const selectedOffice = ref<Office | null>(null)
const searchQuery = ref('')
const selectedCityName = ref(props.initialCity || '')
const currentZoom = ref(6)
const showingCityMarkers = ref(true)

// Search state
const citySearchQuery = ref('')
const officeSearchQuery = ref('')
const showCitySuggestions = ref(false)
const showOfficeSuggestions = ref(false)

// Filtered cities for autocomplete
const filteredCities = computed(() => {
  // Show all cities when focused and empty, or filter by query
  if (!citySearchQuery.value.trim()) {
    return showCitySuggestions.value 
      ? officesByCity.value.sort((a, b) => a.cityName.localeCompare(b.cityName))
      : []
  }
  const query = citySearchQuery.value.toLowerCase()
  return officesByCity.value.filter(city =>
    city.cityName.toLowerCase().includes(query)
  ).sort((a, b) => a.cityName.localeCompare(b.cityName))
})

// Filtered offices for autocomplete
const filteredOfficesForSearch = computed(() => {
  // If a city is selected, show only that city's offices
  let officesToShow = offices.value
  
  // Filter by office type
  if (props.officeType === 'office') {
    officesToShow = officesToShow.filter(o => o.type === 'OFFICE')
  } else if (props.officeType === 'aps') {
    officesToShow = officesToShow.filter(o => o.type === 'APT')
  }
  
  // If city is selected, filter by city
  if (selectedCityName.value) {
    officesToShow = officesToShow.filter(o => o.address.city.name === selectedCityName.value)
  }
  
  // Show all offices when focused and empty, or filter by query
  if (!officeSearchQuery.value.trim()) {
    return showOfficeSuggestions.value ? officesToShow.sort((a, b) => a.name.localeCompare(b.name)) : []
  }
  
  const query = officeSearchQuery.value.toLowerCase()
  return officesToShow.filter(office =>
    office.name.toLowerCase().includes(query) ||
    office.address.city.name.toLowerCase().includes(query)
  ).sort((a, b) => a.name.localeCompare(b.name))
})
// Get unique cities from offices
const cities = computed(() => {
  const citySet = new Set(offices.value.map(o => o.address.city.name))
  return Array.from(citySet).sort()
})

// Group offices by city
const officesByCity = computed((): CityGroup[] => {
  const cityMap = new Map<string, CityGroup>()
  
  let filtered = offices.value

  // Filter by office type
  if (props.officeType === 'office') {
    filtered = filtered.filter(o => o.type === 'OFFICE')
  } else if (props.officeType === 'aps') {
    filtered = filtered.filter(o => o.type === 'APT')
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(o =>
      o.name.toLowerCase().includes(query) ||
      (o.address?.city?.name && o.address.city.name.toLowerCase().includes(query))
    )
  }

  filtered.forEach(office => {
    // Skip offices without city data
    if (!office.address?.city?.name) {
      console.warn('[SpeedyMap] Office missing city data:', office)
      return
    }
    
    const cityName = office.address.city.name
    if (!cityMap.has(cityName)) {
      cityMap.set(cityName, {
        cityName,
        cityId: office.address.city.id,
        offices: [],
        centerLat: 0,
        centerLng: 0
      })
    }
    cityMap.get(cityName)!.offices.push(office)
  })

  // Calculate center point for each city using x/y coordinates
  cityMap.forEach(city => {
    const officesWithCoords = city.offices.filter(o => o.address.x && o.address.y)
    if (officesWithCoords.length > 0) {
      const avgLat = officesWithCoords.reduce((sum, o) => sum + (o.address.y || 0), 0) / officesWithCoords.length
      const avgLng = officesWithCoords.reduce((sum, o) => sum + (o.address.x || 0), 0) / officesWithCoords.length
      city.centerLat = avgLat
      city.centerLng = avgLng
    }
  })

  return Array.from(cityMap.values())
})

// Filter offices based on selected city
const filteredOffices = computed(() => {
  if (!selectedCityName.value) return []
  
  const cityGroup = officesByCity.value.find(c => c.cityName === selectedCityName.value)
  return cityGroup ? cityGroup.offices : []
})

// Fetch offices from API
const fetchOffices = async () => {
  try {
    console.log('[SpeedyMap] Fetching offices from API...')
    const response: any = await $fetch('/api/speedy/offices')
    console.log('[SpeedyMap] API response:', response)
    
    if (response.success && response.data) {
      // Speedy returns {success: true, data: {offices: [], apts: [], all: []}}
      const allOffices = response.data.all || []
      console.log('[SpeedyMap] Raw offices count:', allOffices.length)
      
      offices.value = allOffices.map((office: any) => ({
        ...office,
        // Add compatibility flags
        isAPS: office.type === 'APT',
        isMPS: office.type === 'APT',
        address: {
          ...office.address,
          // Create city object from siteId and siteName
          city: {
            id: office.address.siteId || office.siteId,
            name: office.address.siteName || 'Unknown',
            postCode: office.address.postCode
          },
          // Ensure we have location data
          location: {
            latitude: office.address.y || 0,
            longitude: office.address.x || 0
          },
          fullAddress: office.address.fullAddressString || office.address.siteAddressString || `${office.address.siteName || ''}`
        }
      }))
      
      console.log('[SpeedyMap] Offices loaded:', offices.value.length)
      console.log('[SpeedyMap] First office:', offices.value[0])
      console.log('[SpeedyMap] Cities found:', new Set(offices.value.map((o: any) => o.address.city.name)).size)
    } else {
      console.error('[SpeedyMap] Invalid response format:', response)
    }
  } catch (error) {
    console.error('[SpeedyMap] Failed to fetch offices:', error)
  }
}

// Initialize map
const initMap = () => {
  if (!mapContainer.value) return

  // Create map centered on Bulgaria
  map.value = L.map(mapContainer.value).setView([42.7339, 25.4858], 7)

  // Add OpenStreetMap tiles
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
    maxZoom: 18,
    minZoom: 6
  }).addTo(map.value)

  // Track zoom level
  map.value.on('zoomend', () => {
    if (map.value) {
      currentZoom.value = map.value.getZoom()
      updateMarkerDisplay()
    }
  })

  // Initialize marker cluster group
  markerClusterGroup.value = (L as any).markerClusterGroup({
    maxClusterRadius: 80,
    spiderfyOnMaxZoom: true,
    showCoverageOnHover: false,
    zoomToBoundsOnClick: true
  })
}

// Create city marker icon with count
const createCityIcon = (count: number) => {
  return L.divIcon({
    className: 'city-marker',
    html: `<div class="city-marker-content">
      <div class="city-marker-pin">
        <span class="city-marker-count">${count}</span>
      </div>
    </div>`,
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
  })
}

// Create individual office marker icon with parcel icon
const createOfficeIcon = (isAPS: boolean) => {
  const pinColor = '#2B5BA6' // Speedy Blue for all markers
  
  return L.divIcon({
    className: 'custom-office-marker',
    html: `
      <div class="pin-container">
        <svg class="pin-shape" viewBox="0 0 24 24" fill="${pinColor}">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
        </svg>
        <svg class="pin-icon" viewBox="0 0 24 24" fill="white">
          <path d="M20 8l-8-4-8 4v6c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V8z" opacity="0.3"/>
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm7 10c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V6.3l7-3.11 7 3.11V11z"/>
          <path d="M10.23 13.69L7.41 10.9l-1.41 1.41 4.23 4.24 9.19-9.19-1.41-1.41z"/>
        </svg>
      </div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -40]
  })
}

// Update marker display based on zoom level
const updateMarkerDisplay = () => {
  if (!map.value) return

  const zoom = currentZoom.value
  
  // Show city markers when zoomed out (zoom < 10), individual offices when zoomed in
  if (zoom < 10 && !selectedCityName.value) {
    showCityMarkers()
  } else {
    showOfficeMarkers()
  }
}

// Show city-level markers with counts
const showCityMarkers = () => {
  if (!map.value) return
  
  showingCityMarkers.value = true
  
  // Clear existing markers
  cityMarkers.value.forEach(marker => marker.remove())
  officeMarkers.value.forEach(marker => marker.remove())
  if (markerClusterGroup.value) {
    markerClusterGroup.value.clearLayers()
  }
  cityMarkers.value = []
  officeMarkers.value = []

  // Add city markers
  officesByCity.value.forEach(city => {
    const marker = L.marker([city.centerLat, city.centerLng], {
      icon: createCityIcon(city.offices.length)
    })

    const popupContent = `
      <div class="city-popup">
        <h4>${city.cityName}</h4>
        <p><strong>${city.offices.length} ${city.offices.length === 1 ? 'офис' : 'офиса'}</strong></p>
        <button class="select-city-btn" data-city-name="${city.cityName}">
          Покажи офисите
        </button>
      </div>
    `

    marker.bindPopup(popupContent)
    marker.addTo(map.value!)
    cityMarkers.value.push(marker)

    // Handle city selection from popup
    marker.on('popupopen', () => {
      const btn = document.querySelector(`[data-city-name="${city.cityName}"]`)
      if (btn) {
        btn.addEventListener('click', () => {
          selectedCityName.value = city.cityName
          map.value?.setView([city.centerLat, city.centerLng], 13)
          map.value?.closePopup()
        })
      }
    })
  })
}

// Show individual office markers
const showOfficeMarkers = () => {
  if (!map.value) return
  
  console.log('[SpeedyMap] showOfficeMarkers called, offices.value.length:', offices.value.length)
  
  showingCityMarkers.value = false
  
  // Clear city markers
  cityMarkers.value.forEach(marker => marker.remove())
  cityMarkers.value = []

  // Clear existing office markers
  officeMarkers.value.forEach(marker => marker.remove())
  if (markerClusterGroup.value) {
    markerClusterGroup.value.clearLayers()
  }
  officeMarkers.value = []

  // Determine which offices to show
  let officesToShow = offices.value
  
  // Filter by country - only show Bulgaria offices
  officesToShow = officesToShow.filter(o => {
    const countryCode = (o.address?.city as any)?.country?.code3 || (o.address as any)?.countryCode
    return countryCode === 'BGR' // Bulgaria only
  })
  
  // Filter by office type
  if (props.officeType === 'office') {
    officesToShow = officesToShow.filter(o => !o.isAPS && !o.isMPS)
  } else if (props.officeType === 'aps') {
    officesToShow = officesToShow.filter(o => o.isAPS || o.isMPS)
  }
  
  console.log('[SpeedyMap] selectedCityName.value:', selectedCityName.value)
  console.log('[SpeedyMap] After Bulgaria filter:', officesToShow.length, 'offices')
  
  // If a city is selected, show only that city's offices
  if (selectedCityName.value) {
    const beforeFilter = officesToShow.length
    officesToShow = officesToShow.filter(o => o.address.city.name === selectedCityName.value)
    console.log('[SpeedyMap] Filtered by city:', selectedCityName.value, 'from', beforeFilter, 'to', officesToShow.length)
  }

  console.log('[SpeedyMap] Showing offices:', officesToShow.length)
  console.log('[SpeedyMap] First office to show:', officesToShow[0])

  // Add office markers with clustering
  let markersAdded = 0
  officesToShow.forEach(office => {
    if (!office.address?.location?.latitude || !office.address?.location?.longitude) {
      console.warn('[SpeedyMap] Office missing coordinates:', {
        name: office.name,
        hasAddress: !!office.address,
        hasLocation: !!office.address?.location,
        lat: office.address?.location?.latitude,
        lng: office.address?.location?.longitude,
        x: office.address?.x,
        y: office.address?.y
      })
      return
    }

    const { latitude, longitude } = office.address.location
    
    console.log('[SpeedyMap] Creating marker for:', office.name, 'at', latitude, longitude)
    
    const marker = L.marker([latitude, longitude], {
      icon: createOfficeIcon(office.isAPS || office.isMPS || false)
    })

    const popupContent = `
      <div class="office-popup">
        <h4>${office.name}</h4>
        <p><strong>${office.address.city.name}</strong></p>
        <p>${office.address.fullAddress || ''}</p>
        ${office.phones ? `<p>📞 ${office.phones[0]}</p>` : ''}
        <button class="select-office-btn" data-office-id="${office.id}">
          Избери този офис
        </button>
      </div>
    `

    marker.bindPopup(popupContent)
    
    // Add to cluster group
    if (markerClusterGroup.value) {
      markerClusterGroup.value.addLayer(marker)
      markersAdded++
    }
    
    officeMarkers.value.push(marker)

    // Handle office selection from popup
    marker.on('popupopen', () => {
      const btn = document.querySelector(`[data-office-id="${office.id}"]`)
      if (btn) {
        btn.addEventListener('click', () => {
          selectedOffice.value = office
          officeSearchQuery.value = office.name // Auto-fill dropdown
          map.value?.closePopup()
          // Automatically confirm selection and hide map
          confirmSelection()
        })
      }
    })
  })

  console.log('[SpeedyMap] Markers added to cluster:', markersAdded)

  // Add cluster group to map
  if (markerClusterGroup.value && map.value) {
    map.value.addLayer(markerClusterGroup.value)
    console.log('[SpeedyMap] Cluster group added to map')
  }
}

// Select city from autocomplete
const selectCity = (city: CityGroup) => {
  citySearchQuery.value = city.cityName
  selectedCityName.value = city.cityName
  showCitySuggestions.value = false
  
  // Zoom to city
  if (map.value) {
    map.value.setView([city.centerLat, city.centerLng], 12)
    showOfficeMarkers()
  }
}

// Select office from autocomplete dropdown
const selectOfficeFromDropdown = (office: any) => {
  officeSearchQuery.value = office.name
  showOfficeSuggestions.value = false
  selectedOffice.value = office
  
  // Zoom to office on map
  if (map.value && office.address?.location) {
    map.value.setView([office.address.location.latitude, office.address.location.longitude], 16)
    
    // Open popup for the office after a short delay
    setTimeout(() => {
      const marker = officeMarkers.value.find(m => {
        const latlng = m.getLatLng()
        return latlng.lat === office.address.location.latitude && 
               latlng.lng === office.address.location.longitude
      })
      if (marker) {
        marker.openPopup()
      }
    }, 500)
  }
}

// Hide suggestions with delay for click to register
const hideCitySuggestions = () => {
  setTimeout(() => {
    showCitySuggestions.value = false
  }, 200)
}

const hideOfficeSuggestions = () => {
  setTimeout(() => {
    showOfficeSuggestions.value = false
  }, 200)
}

const isConfirmed = ref(false)

// Confirm office selection
const confirmSelection = () => {
  if (selectedOffice.value) {
    isConfirmed.value = true
    emit('office-selected', selectedOffice.value)
  }
}

// Change office (show map again with current selection)
const changeOffice = () => {
  isConfirmed.value = false
  // Keep selectedOffice, selectedCityName, and search queries populated
  // Just show the map again so user can change selection
  
  // Need to wait for DOM update before invalidating map size
  nextTick(() => {
    // Give more time for the map to become visible
    setTimeout(() => {
      if (map.value) {
        // Force Leaflet to recalculate map size
        map.value.invalidateSize()
        
        // Give the map more time to render after invalidating size
        setTimeout(() => {
          if (map.value && selectedOffice.value?.address?.location) {
            // If we have a selected office, zoom to it on the map
            map.value.setView([
              selectedOffice.value.address.location.latitude,
              selectedOffice.value.address.location.longitude
            ], 16)
            showOfficeMarkers()
          } else if (map.value && selectedCityName.value) {
            // If we only have a city selected, show that city's offices
            const cityGroup = officesByCity.value.find(c => c.cityName === selectedCityName.value)
            if (cityGroup) {
              map.value.setView([cityGroup.centerLat, cityGroup.centerLng], 12)
              showOfficeMarkers()
            }
          }
        }, 150)
      }
    }, 50)
  })
}

// Watch for filter changes
watch([() => props.officeType], () => {
  updateMarkerDisplay()
})

// Watch for city selection
watch(selectedCityName, (newCity) => {
  if (newCity) {
    showOfficeMarkers()
  } else {
    updateMarkerDisplay()
  }
})

// Initialize on mount
onMounted(async () => {
  await fetchOffices()
  initMap()
  showCityMarkers()
})
</script>

<style scoped>
.speedy-office-map {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.search-input-wrapper {
  position: relative;
}

.search-input-wrapper label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
  font-size: 0.9rem;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
  opacity: 0.6;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 2px solid #e0e0e0;
  border-top: none;
  border-radius: 0 0 8px 8px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1001; /* Higher than Leaflet controls (1000) */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.suggestion-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: background 0.2s;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:last-child {
  border-bottom: none;
}

.suggestion-item:hover {
  background: #f8f9ff;
}

.suggestion-item strong {
  display: block;
  color: #333;
  margin-bottom: 0.25rem;
}

.office-count {
  color: #666;
  font-size: 0.85rem;
}

.office-details {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

/* Map wrapper and overlay */
.map-wrapper {
  flex: 1;
  position: relative;
  min-height: 500px;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-message {
  text-align: center;
  padding: 2rem;
  max-width: 400px;
}

.overlay-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.overlay-message h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
}

.overlay-message p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.map-container {
  flex: 1;
  min-height: 500px;
  position: relative;
}

/* Selected Office Card (shown after confirmation) */
.selected-office-card {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(185, 198, 170, 0.1) 0%, rgba(185, 198, 170, 0.05) 100%);
  border: 2px solid #B9C6AA;
  border-radius: 12px;
  position: relative;
  min-height: 200px;
}

.success-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: #B9C6AA;
  color: #2F3A2A;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.selected-office-card h3 {
  margin: 0 0 1rem 0;
  color: #2F3A2A;
  font-size: 1.5rem;
  font-weight: 600;
}

.selected-office-card .office-address {
  margin: 0.5rem 0;
  color: #555;
  font-size: 1rem;
}

.selected-office-card .office-city {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.95rem;
}

.change-office-btn {
  margin-top: 1.5rem;
  padding: 0.75rem 1.5rem;
  background: white;
  color: #2F3A2A;
  border: 2px solid #B9C6AA;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.change-office-btn:hover {
  background: #B9C6AA;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
}

.selected-office-info {
  padding: 1rem;
  background: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

.selected-office-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.selected-office-info p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.confirm-btn {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: #B9C6AA;
  color: #2F3A2A;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-btn:hover {
  background: #A8B599;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(185, 198, 170, 0.3);
}

.confirmed-office-info {
  padding: 1rem;
  background: rgba(185, 198, 170, 0.1);
  border: 2px solid #B9C6AA;
  border-radius: 8px;
  position: relative;
}

.confirmed-office-info .success-icon {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: #B9C6AA;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
}

.confirmed-office-info h4 {
  margin: 0 0 0.5rem 0;
  color: #2F3A2A;
  font-weight: 600;
}

.confirmed-office-info p {
  margin: 0.25rem 0;
  color: #2F3A2A;
  font-size: 0.9rem;
}

/* Marker styles - Parcel Icon */
:deep(.custom-office-marker) {
  background: none;
  border: none;
}

:deep(.pin-container) {
  position: relative;
  width: 32px;
  height: 40px;
}

:deep(.pin-shape) {
  width: 32px;
  height: 40px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.4));
}

:deep(.pin-icon) {
  position: absolute;
  top: 3px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
}

:deep(.marker-office) {
  color: #2196F3;
}

:deep(.marker-aps) {
  color: #FF9800;
}

/* Popup styles */
:deep(.office-popup) {
  padding: 0.5rem;
  min-width: 200px;
}

:deep(.office-popup h4) {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1rem;
}

:deep(.office-popup p) {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.85rem;
}

:deep(.select-office-btn) {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.5rem;
  background: #B9C6AA;
  color: #2F3A2A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.select-office-btn:hover) {
  background: #A8B599;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(185, 198, 170, 0.3);
}

/* City marker styles */
:deep(.city-marker) {
  background: none;
  border: none;
}

:deep(.city-marker-content) {
  position: relative;
}

:deep(.city-marker-pin) {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.3);
  border: 3px solid white;
}

:deep(.city-marker-count) {
  transform: rotate(45deg);
  color: white;
  font-weight: bold;
  font-size: 16px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.3);
}

/* City popup styles */
:deep(.city-popup) {
  padding: 0.75rem;
  min-width: 200px;
}

:deep(.city-popup h4) {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.1rem;
  font-weight: 600;
}

:deep(.city-popup p) {
  margin: 0.5rem 0;
  color: #666;
  font-size: 0.9rem;
}

:deep(.select-city-btn) {
  margin-top: 0.75rem;
  width: 100%;
  padding: 0.6rem;
  background: #B9C6AA;
  color: #2F3A2A;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.2s;
}

:deep(.select-city-btn:hover) {
  background: #A8B599;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(185, 198, 170, 0.3);
}

/* Office marker styles */
:deep(.office-marker) {
  background: none;
  border: none;
}

:deep(.office-marker-pin) {
  width: 30px;
  height: 42px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

:deep(.office-marker-office) {
  color: #2196F3;
}

:deep(.office-marker-aps) {
  color: #FF9800;
}

:deep(.office-marker-icon) {
  font-size: 24px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}
</style>
