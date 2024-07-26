import { getBaseEnvironment } from "https://deno.land/x/remapper@3.1.2/src/general.ts";
import { Arc, Bomb, Chain, Difficulty,Note,RawKeyframesAny, Wall } from "https://deno.land/x/remapper@3.1.2/src/mod.ts"

type option_animations = {
    tracks?: boolean
    notes?: boolean
    walls?: boolean
    bombs?: boolean
    arcs?: boolean
    chains?: boolean

    fakeNotes?: boolean
    fakeBombs?: boolean
    fakeWalls?: boolean
    fakeChains?: boolean
}

type target = "Note" | "Wall" | "Bomb" | "Arc" | "Chain" | "FakeNote" | "FakeWall" | "FakeBomb" | "FakeChain"

type variant = Note[] | Wall[] | Bomb[] | Arc[] | Chain[] // No way this works lmaoooooo

type keyframeDefinition = [string, RawKeyframesAny | string]; // So simple yet so fucking awesome

// Identifiers | Animate Track: T_ , Note: N_ , Bomb: B_ , Wall: W_ , Arc: A_ , Chain: C_.
// Fake Identifiers: Note: FN_ , Bomb: FB_ , Wall: FW_ , Chain: FC_ . 

// AnimationTracks, Vanilla Objects (Notes/Walls/Bombs/Arcs/Chains)
export class Optimize {
    private difficulty?: Difficulty;
    public animations?: option_animations = {tracks: true, bombs: true, notes: true, walls: true, arcs: true, fakeNotes: true, fakeBombs: true,  fakeChains: true, fakeWalls: true, chains: true}

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
                                        diff.pointDefinitions[`T_${base[0]}_${keyframeSetIndex}`] = base[1];
                                        existingPoints.push([`T_${base[0]}_${keyframeSetIndex}`,base[1]]);
                                        baseEvent.data[base[0]] = `T_${base[0]}_${keyframeSetIndex}`
                                        pairEvent.data[pair[0]] = `T_${base[0]}_${keyframeSetIndex}`
                                        keyframeSetIndex++
                                    }
                                }
                            })
                        })
                    })
                })
            }
            if(this.animations.notes) {
                this.joeBiden("Note")
            }
            if(this.animations.fakeNotes) {
                this.joeBiden("FakeNote")
            }
            if(this.animations.bombs) {
                this.joeBiden("Bomb")
            }
            if(this.animations.fakeBombs) {
                this.joeBiden("FakeBomb")
            }
            if(this.animations.walls) {
                this.joeBiden("Wall")
            }
            if(this.animations.fakeWalls){
                this.joeBiden('FakeWall')
            }
            if(this.animations.chains) {
                this.joeBiden("Chain")
            }
            if(this.animations.fakeChains) {
                this.joeBiden("FakeChain")
            }
            if(this.animations.arcs) {
                this.joeBiden("Arc")
            }
        }
    }


    private joeBiden(target: target) {
        const diff = this.difficulty;
        if(diff) {
            let prefix: string = "NA";
            let gObject: variant;
            switch(target) {
                case "Note":
                    gObject = diff.notes;
                    prefix = "N";
                    break;
                case "FakeNote":
                    gObject = diff.fakeNotes;
                    prefix = "FN";
                    break;
                case "Bomb":
                    gObject = diff.bombs;
                    prefix = "B";
                    break;
                case "FakeBomb":
                    gObject = diff.fakeBombs;
                    prefix = "FB";
                    break;
                case "Wall":
                    gObject = diff.walls;
                    prefix = "W";
                    break;
                case "FakeWall":
                    gObject = diff.fakeWalls;
                    prefix = "FW";
                    break;
                case "Chain":
                    gObject = diff.chains;
                    prefix = "C";
                    break;
                case "FakeChain":
                    gObject = diff.fakeChains;
                    prefix = "FC";
                    break;
                case "Arc":
                    gObject = diff.arcs;
                    prefix = "A";
            }

            let keyframeSetIndex = 0;
            
            if(gObject) {
                gObject.forEach(baseObject => {
                    if(!baseObject.animation) return; // Dont do shit if the note doesnt have animation(s).
                    let existingPoints: keyframeDefinition[] = [];
                    let baseAnim: keyframeDefinition[] = [];
                    Object.entries(diff.pointDefinitions).forEach(x=> {existingPoints.push(x)});
                    Object.entries(baseObject.animation).forEach(x=> {
                        if(Array.isArray(x)) {
                            baseAnim.push([x[0],x[1] as RawKeyframesAny]);
                        }
                    })
        
                    gObject.forEach(pairObject => {
                        if(baseObject == pairObject || !baseObject.animation) return;
                        let pairAnim: keyframeDefinition[] = [];
                        Object.entries(pairObject.animation).forEach(x=> {
                            if(Array.isArray(x)) {
                                pairAnim.push([x[0],x[1] as RawKeyframesAny]);
                            }
                        })
        
                        pairAnim.forEach(pair => {
                            baseAnim.forEach(base => {
                                if(checkEqual(pair[1],base[1]) && pair[0] == base[0]) {
                                    let pointExists = 0;
                                    existingPoints.forEach(point => {
                                        if(checkEqual(point[1],pair[1])) {
                                            baseObject.animation[base[0]] = point[0];
                                            pairObject.animation[pair[0]] = point[0];
                                            pointExists++
                                        }
                                    })
                                    if(pointExists > 0) return;
                                    if(typeof base[1] != "string") {
                                        diff.pointDefinitions[`${prefix}_${base[0]}_${keyframeSetIndex}`] = base[1];
                                        existingPoints.push([`${prefix}_${base[0]}_${keyframeSetIndex}`,base[1]]);
                                        baseObject.animation[base[0]] = `${prefix}_${base[0]}_${keyframeSetIndex}`
                                        pairObject.animation[pair[0]] = `${prefix}_${base[0]}_${keyframeSetIndex}`
                                        keyframeSetIndex++
                                    }
                                }
                            })
                        })
                    })
        
                })
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
