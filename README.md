Im too lazy to make a decent readMe.


## OPTIMIZERRRR!


### How to use: 

Import the Optimizer class into your script:

``
import { Optimize } from 'https://raw.githubusercontent.com/UGEcko/Optimizer/main/mod.ts'
``


Next, create a new `Optimizer` class. (Before `map.save` but preferably after anything else) with your Difficulty referenced in the class:

```ts
const map = new Difficulty("NormalStandard", "ExpertStandard");
new Optimize(map);
```


There are some settings that come along with the Optimizer; you can enable or disable optimization of the following: Bombs, Notes, Walls, and Animation Tracks:

```ts
const optimizer = new Optimize(map);
optimizer.animations = {
    bombs: false,
    notes: false
}
// This disables bomb and note optimization. All objects by default are optimized.
```


Thats it! All Note, Bomb, Wall, and Track animations will be sent to a point definition if there are more than 2 instances.



## INFO:

**Please report any issues to my discord: UGEcko**
