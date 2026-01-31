export interface ApiCall<T> {
  call: Promise<T>;
  controller: AbortController;
}
