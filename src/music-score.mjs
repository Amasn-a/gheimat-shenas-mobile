// Original, light quiz-game loop: 104 BPM, plucked melody, soft bass and offbeat chords.
// Written for this game; contains no sampled recording or melody from another title.
export const BPM=104;
export const BASS=[48,48,45,45,53,53,55,55];
export const CHORDS=[[60,64,67],[60,64,67],[57,60,64],[57,60,64],[60,65,69],[60,65,69],[59,62,67],[59,62,67]];
export const MELODY=[
 [0,72],[.75,76],[1.5,79],[2.5,76],[3.25,74],
 [4,72],[5,67],[5.75,72],[6.5,76],
 [8,69],[8.75,72],[9.5,76],[10.75,74],[11.5,72],
 [12,69],[13.5,67],[14.25,69],[15,72],
 [16,77],[16.75,76],[17.5,72],[18.5,69],[19.25,72],
 [20,77],[21,79],[22,76],[23,72],
 [24,74],[24.75,79],[25.5,77],[26.5,74],[27.25,71],
 [28,67],[29,71],[30,74],[31,71]
];
export const midi=n=>440*2**((n-69)/12);
