/**
 * A bcrypt library for Node.js, based on the API of 
 * `bcrypt`/`bcryptjs`, written in Rust.
 * 
 * Uses Neon for writing the Rust/Node.js bindings, and
 * the Rust library `bcrypt`.
 */
declare module "bcrypt-rsjs" {
    /** Minimum allowable cost. */
    export const MIN_COST: number;

    /** Maximum allowable cost. */
    export const MAX_COST: number;
    
    /** Default cost to be used if not specified. */
    export const DEFAULT_COST: number;

    /**
     * 
     * @param password Password data to be hashed 
     * @param cost Optional number of salt rounds. If not 
     *   set, `DEFAULT_COST` will be used.
     * @returns Bcrypt hash of `password`
     */
    export function hash(password: string, cost?: number): Promise<string>;

    /**
     * 
     * @param password Password data to be checked 
     * @param hash Hash of the password to check against
     * @returns Does `password` match the bcrypt hash, `hash`?
     */
     export function compare(password: string, hash: string): Promise<boolean>;

     /**
     * 
     * @param password Password data to be hashed 
     * @param cost Optional number of salt rounds. If not 
     *   set, `DEFAULT_COST` will be used.
     * @returns Bcrypt hash of `password`
     */
    export function hashSync(password: string, cost?: number): string;

    /**
     * 
     * @param password Password data to be checked 
     * @param hash Hash of the password to check against
     * @returns Does `password` match the bcrypt hash, `hash`?
     */
     export function compareSync(password: string, hash: string): boolean;


}
