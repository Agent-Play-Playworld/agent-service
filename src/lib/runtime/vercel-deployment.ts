export const vercelFramework = "nextjs";
export const vercelFunctionRuntime = "nodejs";
export const vercelFunctionDynamic = "force-dynamic";
export const vercelFunctionMaxDurationSeconds = 300;
export const vercelTracedRuntimeFiles = [
  "./node-tuning.yaml",
  "./src/**/*.txt",
] as const;

export const getVercelOutputFileTracingIncludes = (): Record<string, string[]> => {
  return {
    "/*": [...vercelTracedRuntimeFiles],
  };
};
