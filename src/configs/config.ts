const config = {
    baseUrl:String(import.meta.env.VITE_MEDI_ROUTINES_SERVER_URL),
    timezoneUrl:String(import.meta.env.VITE_TIMEZONES_SERVER_URL),
}
export default config;
export type Config = typeof config;