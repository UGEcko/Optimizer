# OPTIMIZER *(For Remapper)*
Optimizer is an easy-to-use optimizer for animations on various beatmap objects.



## Implementation

Optimizer is insanely easy to implement into any remapper map using V3;

1. Import `Optimizer` into your script
```ts
import { Optimize } from 'https://raw.githubusercontent.com/UGEcko/Optimizer/main/mod.ts'
```
2. Create an instance of `Optimizer` (Preferably after any scripting stuff but before saving the difficulty).
```ts
const map = new Difficulty("NormalStandard", "ExpertStandard");
new Optimize(map);
```

<hr>

## Settings
Currently, there is only one setting in the class, and thats to disable or enable optimization of specific beatmap objects. All V3 objects are supported:
- Notes
- Fake Notes
- Bombs
- Fake Bombs
- Walls
- Fake Walls
- Chains
- Fake Chains
- Arcs
- Custom Events

All beatmap objects *by default* are optimized. Say you dont want to add extra processing or dont want to optimize a specific beatmap object. Simply use the animations property of Optimize to determine what to leave out:

```ts
// This disables note, bomb, and fake Chain animation optimizations.
const optimizer = new Optimize(map);
optimizer.animations = {
    bombs: false,
    notes: false,
    fakeChains: false
}

// ----- OR ------

new Optimize(map).animations = {
    bombs: false,
    notes: false,
    fakeChains: false
}

```


## INFO:
For example: If a `Note` rotation animation matches a point definition with an `Arc` prefix, the note animimation will reference the Arc definition; This is normal as seperating animations by their object type is stupid since they achieve the same thing.


**Please report any issues to my discord: UGEcko | If you have any recommendations or additions to Optimizer please reach out!**
