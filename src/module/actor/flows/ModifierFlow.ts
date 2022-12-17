import { DocumentSituationModifiers } from './../../rules/DocumentSituationModifiers';
import {SR5Actor} from "../SR5Actor";


export interface ModifierFlowOptions {
    // See SituationModifier applicable
    applicable?: string[]
}

/**
 * Map the different kinds of modifier handlings that have been deployed accross the systems lifetime.
 * 
 * All actor modifier totals should be access through this interface and only mapped onto the whatever
 * data / api lies underneath.
 * 
 * Use this interface to retrieve a total value, not values used to create that total.
 * 
 */
export class ModifierFlow {
    // The actor document to retrieve modifiers for.
    document: SR5Actor;

    constructor(document: SR5Actor) {
        this.document = document;
    }

    /**
     * Retrieve a total modifier value for a specific modifier
     * 
     * @param name The internal modifiers name. This can either be a situation modifier or an actor modifier
     * @param options 
     * @returns Total value requested or zero, should the requested modifier not exist.
     */
    async totalFor(name: string, options: ModifierFlowOptions={}): Promise<number> {
        // Get special cases that need local handling.
        if (this[name] !== undefined) return this[name];

        // Get global modifiers that can come from the general modifier system.
         const modifiers = this.document.getSituationModifiers();
        //@ts-ignore
        if (modifiers.source.hasOwnProperty(name)) return modifiers.getTotalFor(name, {applicable: options.applicable});

        // Get global modifiers that come from the legacy actor modifier system.
        return this.document.getModifier(name) || 0;
    }

    /**
     * Translate simple modifier type string to the differently named actor / document method.
     */
    get wounds(): number {
        return this.document.getWoundModifier();
    }
}