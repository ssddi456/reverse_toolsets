module "lebab" {
    export function transform(code: string, options: {}): { code: string, warnings: { info: string }[] }
}