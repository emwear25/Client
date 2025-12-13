import { ref, onMounted, onUnmounted, type Ref } from 'vue';

interface InfiniteScrollOptions {
    /**
     * The element to observe for intersection (usually the last item in the list)
     */
    target: Ref<HTMLElement | null>;

    /**
     * Callback function to load more items
     */
    onLoadMore: () => void | Promise<void>;

    /**
     * Whether there are more items to load
     */
    hasMore: Ref<boolean>;

    /**
     * Whether currently loading
     */
    isLoading: Ref<boolean>;

    /**
     * Root margin for the intersection observer (default: '200px')
     * This triggers loading before the user reaches the exact bottom
     */
    rootMargin?: string;

    /**
     * Threshold for the intersection observer (default: 0.1)
     */
    threshold?: number;
}

/**
 * Composable for implementing infinite scroll functionality
 * Uses Intersection Observer API to detect when user scrolls near the bottom
 */
export function useInfiniteScroll(options: InfiniteScrollOptions) {
    const {
        target,
        onLoadMore,
        hasMore,
        isLoading,
        rootMargin = '200px',
        threshold = 0.1,
    } = options;

    let observer: IntersectionObserver | null = null;

    const observe = () => {
        if (!target.value) return;

        // Create intersection observer
        observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];

                // If the target is intersecting, has more items, and not currently loading
                if (entry && entry.isIntersecting && hasMore.value && !isLoading.value) {
                    onLoadMore();
                }
            },
            {
                root: null, // viewport
                rootMargin,
                threshold,
            }
        );

        observer.observe(target.value);
    };

    const unobserve = () => {
        if (observer && target.value) {
            observer.unobserve(target.value);
            observer.disconnect();
            observer = null;
        }
    };

    // Re-observe when target changes
    watch(target, (newTarget, oldTarget) => {
        if (oldTarget) {
            unobserve();
        }
        if (newTarget) {
            observe();
        }
    });

    onMounted(() => {
        // Small delay to ensure DOM is ready
        setTimeout(() => {
            observe();
        }, 100);
    });

    onUnmounted(() => {
        unobserve();
    });

    return {
        observe,
        unobserve,
    };
}
