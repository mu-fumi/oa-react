declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
    export function ReactComponent(
        props: React.SVGProps<SVGSVGElement>,
    ): React.ReactElement;
    const url: string;
    export default url;
}
declare namespace NodeJS {
    export interface ProcessEnv {
        NODE_ENV: string;
        APP_API_BASE_URL: string;
    }
}
