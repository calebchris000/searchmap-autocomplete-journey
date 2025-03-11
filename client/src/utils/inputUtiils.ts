export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  timeout: number = 500,
): ((...args: Parameters<T>) => void) => {
  let timer: NodeJS.Timeout | undefined;

  return function (this: unknown, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
};
