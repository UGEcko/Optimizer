// -- OPTIMIZER --
function beatmap_optimize(difficulty) { // Optimize all animations from all beatmap objects and animateTracks.
  if(difficulty)
  {
    // Comment out any of the joeBiden functions that may process an object that you dont want optimized.
    joeBiden(notes)
    joeBiden(bombs)
    joeBiden(obstacles)
    joeBiden(sliders)
    joeBiden(burstSliders)
    joeBiden(fakeNotes)
    joeBiden(fakeBombs)
    joeBiden(fakeObstacles)
    joeBiden(fakeBurstSliders)
    joeBiden(customEvents)
  }
}

function joeBiden(target) {
  const diff = difficulty;
  if(diff) {
      let prefix = "anim";
      
      let keyframeSetIndex = 0;
      
      if(target) {
          target.forEach(baseObject => {
            let baseData;

            if(baseObject.customData && baseObject.customData.animation) {
                baseData = baseObject.customData.animation
            }
            else if(baseObject.d) {
                baseData = baseObject.d
            }
            else {
              return; // If there is no animations.
            }
            // -------------------------------
            
            let existingPoints = []; // [string,number[][]][]
            let baseAnim = []; // [string,number[][]][]
            Object.entries(pointDefinitions).forEach(x=> {existingPoints.push(x)});
            Object.entries(baseData).forEach(x=> {
              if(x[0] == "duration" || x[0] == "track") return; // Add any names of properties that shouldnt be processed here, this goes for both beatmap obj and customEvent.
                if(Array.isArray(x)) {
                    baseAnim.push(x);
                }
            })
            
            target.forEach(pairObject => { // Go through the beatmap object again to compare.
              let pairData;

              if(pairObject.customData && pairObject.customData.animation) {
                  pairData = pairObject.customData.animation
              }
              else if(pairObject.d) {
                  pairData = pairObject.d;
              }
              else {
                return; // If there is no animations.
              }
              
                 // Prevent processing of the same object, or an object w/o animation properties.
                let pairAnim = []; // [string,number[][]][]
                Object.entries(pairData).forEach(x=> {
                    if(x[0] == "duration" || x[0] == "track") return; // Add any names of properties that shouldnt be processed here, this goes for both beatmap obj and customEvent.
                    if(Array.isArray(x)) {
                        pairAnim.push(x);
                    }
                })

                pairAnim.forEach(pair => {
                    baseAnim.forEach(base => {
                        if(checkEqual(pair[1],base[1])) { // If the compared keyframes are the same.
                            let pointExists = 0;
                            existingPoints.forEach(point => { // If an existing point is equal to the two objects.
                                if(checkEqual(point[1],pair[1])) {
                                    baseData[base[0]] = point[0];
                                    pairData[pair[0]] = point[0];
                                    pointExists++
                                }
                            })
                            if(pointExists > 0) return; // Dont progress if they are set to an existing definition.
                            if(typeof base[1] != "string") { // Idk why I added this, doesnt hurt tho lmao
                              // Add, set, and assign the point definitions.
                                pointDefinitions[`${prefix}_${base[0]}_${keyframeSetIndex}`] = base[1];
                                existingPoints.push([`${prefix}_${base[0]}_${keyframeSetIndex}`,base[1]]);
                                baseData[base[0]] = `${prefix}_${base[0]}_${keyframeSetIndex}`
                                pairData[pair[0]] = `${prefix}_${base[0]}_${keyframeSetIndex}`
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

function checkEqual(obj1, obj2) { // Swifter made this shit in discord, you didnt hear it from me
  if (obj1 === null || obj2 === null) return obj1 === obj2
  if (typeof obj1 !== typeof obj2) return false
  
  if (typeof obj1 === "object") {
    if (Array.isArray(obj1)) {
      // array
      const arr2 = obj2;
      if (obj1.length !== arr2.length) return false
      return obj1.every((x, i) => checkEqual(x, arr2[i]))
    } else {
      // object
      const rec1 = obj1
      const rec2 = obj2;
      if (Object.values(rec1).length !== Object.values(rec2).length) return false
      if (!checkEqual(Object.keys(rec1), Object.keys(rec2))) return false
      return Object.entries(rec1).every(([key, value]) => checkEqual(value, rec2[key]))
    }
  } else {
    // number, boolean, string, undefined
    return obj1 === obj2
  }
}

// UNCOMMENT TO OPTIMIZE
// beatmap_optimize(difficulty);

//! -- OPTIMIZER -- 
