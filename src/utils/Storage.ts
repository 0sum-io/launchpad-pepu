export interface Storage {
  get(key: string): string | undefined;

  set(key: string, value: string): void;

  remove(key: string): void;
}

class MemoStorage implements Storage {
  private storage = new Map<string, string>();

  public get(key: string) {
    return this.storage.get(key);
  }

  public set(key: string, value: string) {
    this.storage.set(key, value);
  }

  public remove(key: string) {
    this.storage.delete(key);
  }
}
class LocalStorage implements Storage {
  public static canUse(): boolean {
    const TEST_KEY = "LOCAL_STORAGE_TEST_KEY";

    try {
      localStorage.setItem(TEST_KEY, "test");
      localStorage.removeItem(TEST_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  public get(key: string) {
    return localStorage.getItem(key) ?? undefined;
  }

  public set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public remove(key: string) {
    localStorage.removeItem(key);
  }
}
class SessionStorage implements Storage {
  public static canUse(): boolean {
    const TEST_KEY = "SESSION_STORAGE_TEST_KEY";

    try {
      sessionStorage.setItem(TEST_KEY, "test");
      sessionStorage.removeItem(TEST_KEY);
      return true;
    } catch (err) {
      return false;
    }
  }

  public get(key: string) {
    return sessionStorage.getItem(key) ?? undefined;
  }

  public set(key: string, value: string) {
    sessionStorage.setItem(key, value);
  }

  public remove(key: string) {
    sessionStorage.removeItem(key);
  }
}

export function generateStorage(): Storage {
  if (LocalStorage.canUse()) {
    return new LocalStorage();
  }
  return new MemoStorage();
}

export function generateSessionStorage(): Storage {
  if (SessionStorage.canUse()) {
    return new SessionStorage();
  }
  return new MemoStorage();
}

export const safeLocalStorage = generateStorage();
export const safeSessionStorage = generateSessionStorage();
