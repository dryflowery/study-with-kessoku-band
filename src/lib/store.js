import { writable } from 'svelte/store';

export let problemCnt = writable(268); // 전체 문제
export let solveProblemCnt = writable(0);  // 풀 문제

export let favorites = writable([]); // 즐겨찾기
export let favoritesCnt = writable(0); // 즐겨찾기 개수
export let correctRate = writable([]); // 맞춘 횟수 / 푼 횟수
export let answer = writable([]); // 정답

export let withKita = writable(true);
export let withRyo = writable(false);
export let withBocchi = writable(false);
export let withNijika = writable(false);

export let loadCnt = writable(0);