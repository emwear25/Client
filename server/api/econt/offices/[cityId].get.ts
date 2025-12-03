export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const backendUrl = config.public.apiBase || "http://localhost:3030";

  const cityId = getRouterParam(event, "cityId");

  try {
    const data = await $fetch(`${backendUrl}/api/econt/offices/${cityId}`);
    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch offices for city",
    });
  }
});
