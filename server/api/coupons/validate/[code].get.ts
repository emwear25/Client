export default defineEventHandler(async (event) => {
  const code = getRouterParam(event, "code");
  const config = useRuntimeConfig();
  const backendUrl = config.public.apiBase || "http://localhost:3030";

  if (!code) {
    throw createError({
      statusCode: 400,
      message: "Моля въведете код на купон",
    });
  }

  try {
    const response = await $fetch(`${backendUrl}/api/coupons/validate/${code}`, {
      method: "GET",
    });

    return response;
  } catch (error: any) {
    // Forward the exact error from backend
    const statusCode = error.statusCode || error.response?.status || 500;
    const message = error.data?.message || error.message || "Грешка при проверка на купона";

    throw createError({
      statusCode,
      message,
      data: error.data,
    });
  }
});
