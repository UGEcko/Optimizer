import { Difficulty,RawKeyframesAny } from "https://deno.land/x/remapper@3.1.2/src/mod.ts"

type option_animations = {
    tracks?: boolean,
    notes?: boolean,
    walls?: boolean,
    bombs?: boolean
}

type keyframeDefinition = [string, RawKeyframesAny | string];


// AnimationTracks, Vanilla Objects (Notes/Walls/Bombs)
export class Optimize {
    private difficulty?: Difficulty;
    public animations?: option_animations = {tracks: true, bombs: true, notes: true, walls: true}

    constructor(diff: Difficulty) {
        this.difficulty = diff;

        if(this.animations) {
            const diff = this.difficulty;
            if(this.animations.tracks) {
                const events = diff.customEvents;

                let keyframeSetIndex = 0;
                
                events.forEach(baseEvent => {
                    if(baseEvent.type != "AnimateTrack") return;
                    let existingPoints: keyframeDefinition[] = [];
                    let baseProperties: keyframeDefinition[] = [];
                    Object.entries(baseEvent.data).forEach(x => {
                        if(x[0] == "track" || x[0] == "duration") return;
                        baseProperties.push(x);
                    })
                    Object.entries(diff.pointDefinitions).forEach(x=> {existingPoints.push(x)});
                    
                    events.forEach(pairEvent => {
                        if(baseEvent.data == pairEvent.data) return; // So pairEvent foreach doesnt process the baseEvent

                        if(pairEvent.type != "AnimateTrack") return;
                        let pairProperties: keyframeDefinition[] = [];
                        Object.entries(pairEvent.data).forEach(x => {
                            if(x[0] == "track" || x[0] == "duration") return;
                            pairProperties.push(x);
                        })

                        pairProperties.forEach(pair => {
                            baseProperties.forEach(base => {
                                if(checkEqual(pair[1],base[1]) && pair[0] === base[0]) { // If the arrays/props are the same
                                    let pointExists = 0;
                                    existingPoints.forEach(point => {
                                        if(checkEqual(point[1],pair[1])) { // If the keyframes are same to the pointdef, set the events keyframes to the pointDef.
                                            baseEvent.data[base[0]] = point[0];
                                            pairEvent.data[pair[0]] = point[0];
                                            pointExists++
                                        }
                                    })
                                    if(pointExists > 0) return;
                                    if(typeof base[1] != "string") { // If it wasnt assigned a pointDef, create one.
                                        diff.pointDefinitions[`${base[0]}_${keyframeSetIndex}`] = base[1];
                                        existingPoints.push([`${base[0]}_${keyframeSetIndex}`,base[1]]);
                                        baseEvent.data[base[0]] = `${base[0]}_${keyframeSetIndex}`
                                        pairEvent.data[pair[0]] = `${base[0]}_${keyframeSetIndex}`
                                        keyframeSetIndex++
                                    }
                                }
                            })
                        })
                    })
                })
            }
            if(this.animations.notes) {
                const notes = this.difficulty.notes;
            }
            if(this.animations.bombs) {
                const bombs = this.difficulty.bombs;
            }
            if(this.animations.walls) {
                const walls = this.difficulty.walls;
            }
        }
    }

}
function checkEqual(obj1: unknown, obj2: unknown): boolean { // Thanks swiffer
    if (obj1 === null || obj2 === null) return obj1 === obj2
    if (typeof obj1 !== typeof obj2) return false
    
    if (typeof obj1 === "object") {
      if (Array.isArray(obj1)) {
        // array
        const arr2 = obj2 as unknown[]
        if (obj1.length !== arr2.length) return false
        return obj1.every((x, i) => checkEqual(x, arr2[i]))
      } else {
        // object
        const rec1 = obj1 as Record<string | symbol | number, unknown>
        const rec2 = obj2 as Record<string | symbol | number, unknown>
        if (Object.values(rec1).length !== Object.values(rec2).length) return false
        if (!checkEqual(Object.keys(rec1), Object.keys(rec2))) return false
        return Object.entries(rec1).every(([key, value]) => checkEqual(value, rec2[key as keyof typeof rec2]))
      }
    } else {
      // number, boolean, string, undefined
      return obj1 === obj2
    }
}
