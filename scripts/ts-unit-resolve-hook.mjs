const hasExtension = (specifier) => /\.[a-zA-Z0-9]+$/.test(specifier);

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith(".") && !hasExtension(specifier)) {
    try {
      return await nextResolve(`${specifier}.ts`, context);
    } catch (error) {
      if (error?.code !== "ERR_MODULE_NOT_FOUND") throw error;
    }
  }

  return nextResolve(specifier, context);
}
