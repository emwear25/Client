export default defineEventHandler(async (_event) => {
  const config = useRuntimeConfig();
  const backendUrl = config.public.apiBase || "http://localhost:3030";

  try {
    const data = await $fetch(`${backendUrl}/api/econt/offices`);
    return data;
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch offices",
    });
  }
});
