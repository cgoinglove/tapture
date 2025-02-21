export const getBrowserRegion = () => {
  const system = navigator.language?.split('-')[0]
  return system || 'en'
}
