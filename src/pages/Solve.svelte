<script>
    import { push } from "svelte-spa-router";
    import { problemCnt, solveProblemCnt, favorites, favoritesCnt, 
             correctRate, answer, withKita, withRyo, withBocchi, withNijika } from "../lib/store";
    import { onMount } from "svelte";

    let problem = [];
    $: isCorrect = false;
    $: isIncorrect = false;
    $: isEnd = false;
    $: isNormal = true;
    $: curProblemNum = 0;
    $: imagePath = '';

    onMount(() => {
        if (performance.navigation.type === 1) {
            push('/');
        }

        if($solveProblemCnt == 9999) { // 정답률 하위 30개
            $solveProblemCnt = 30;

            let rate = [];
            for (let i = 0; i < $problemCnt; i++) {
                rate.push([$correctRate[i][1] === 0 ? 1000 : ($correctRate[i][0] / $correctRate[i][1]) * 100, i]);
            }

            rate.sort((x, y) => x[0] - y[0]);
            
            for (let i = 0; i < 30; i++) {
                problem.push(rate[i][1]);
            }
        }
        else if($solveProblemCnt == 8888) { // 즐겨찾기
            $solveProblemCnt = $favoritesCnt

            $favorites.forEach((element, index) => {
                if(element == 1) {
                    problem.push(index)
                }
            });

            problem.sort(() => Math.random() - 0.5); // 랜덤 셔플
        }
        else if($solveProblemCnt == 7777) { // 처음부터 순서대로
            $solveProblemCnt = $problemCnt;

            for(let i = 0; i < 268; i++) {
                problem.push(i);
            }
        }
        else { // 랜덤으로 문제 선정
            let problemSet = new Set(); 

            while (problemSet.size < $solveProblemCnt) {
                let randNum = Math.floor(Math.random() * ($problemCnt)); 
                problemSet.add(randNum); 
            }

            problemSet.forEach(element => {
                problem.push(element);
            });
        }

        imagePath = `images/problem/${problem[curProblemNum]}.PNG`;
    })

    const grading = (selected) => {
        isNormal = isCorrect = isIncorrect = false;

        if(selected == $answer[problem[curProblemNum]]) {
            isCorrect = true;
            $correctRate[problem[curProblemNum]][0]++; // 맞춘 횟수
            $correctRate[problem[curProblemNum]][1]++; // 전체 횟수
        }
        else {
            isIncorrect = true;
            $correctRate[problem[curProblemNum]][1]++; // 전체 횟수
        }

        localStorage.setItem('correctRate', JSON.stringify($correctRate));
    };

    const goNext = () => {
        if(curProblemNum == $solveProblemCnt - 1) {
            imagePath = `images/band.png`;
            curProblemNum = curProblemNum + 1;

            isCorrect = isIncorrect = isNormal = false;
            isEnd = true;
            return;
        }
        else if(curProblemNum == $solveProblemCnt) {
            return;
        }

        isCorrect = isIncorrect = isEnd = false;
        isNormal = true;
        curProblemNum = curProblemNum + 1;
        imagePath = `images/problem/${problem[curProblemNum]}.PNG`;
    };

    const goPrev = () => {
        if(curProblemNum == 0) {
            return;
        }

        isCorrect = isIncorrect = isEnd = false;
        isNormal = true;
        curProblemNum = curProblemNum - 1;
        imagePath = `images/problem/${problem[curProblemNum]}.PNG`;
    };

    const addFavorites = () => {
        if(problem[curProblemNum] == undefined) {
            alert("즐겨찾기에 추가할 수 없습니다.")
        }
        else {
            $favorites[problem[curProblemNum]] = 1;
            $favoritesCnt++;
            localStorage.setItem('favorites', JSON.stringify($favorites));

            alert("즐겨찾기에 추가되었습니다")
        }
    };

    const removeFavorites = () => {
        $favorites[problem[curProblemNum]] = 0;
        $favoritesCnt--;
        localStorage.setItem('favorites', JSON.stringify($favorites));

        alert("즐겨찾기에서 삭제되었습니다")
    };

    const changePartner = () => {
        if($withKita) {
            $withRyo = true;
            $withKita = $withBocchi = $withNijika = false;
        }
        else if($withRyo) {
            $withBocchi = true;
            $withKita = $withRyo = $withNijika = false;
        }
        else if($withBocchi) {
            $withNijika = true;
            $withKita = $withRyo = $withBocchi = false;
        }
        else {
            $withKita = true;
            $withRyo = $withBocchi = $withNijika = false;
        }
    };
</script>
  
<main>
    <div id="header">
        <div id="home-container">
            <span style="font-size: 3rem;">홈으로 이동하기 →</span>
            
            {#if $withKita}
                <img alt="" src="images/kita/home.png" on:click={()=> push('/')}>
            {:else if $withRyo}
                <img alt="" src="images/ryo/home.png" on:click={()=> push('/')}>
            {:else if $withBocchi}
                <img alt="" src="images/bocchi/home.png" on:click={()=> push('/')}>
            {:else}
                <img alt="" src="images/nijika/home.png" on:click={()=> push('/')}>
            {/if}
        </div>

        <div id="cnt-container">
            <span style="font-size: 3rem;">맞춘 문제: {curProblemNum} / {$solveProblemCnt}</span>
        </div>
    </div>

    <div id="main-container">
        <div id="problem-container">
            <img alt="" src={imagePath} on:click={() => 
                alert(`시도 횟수: ${$correctRate[problem[curProblemNum]][1]}\n맞춘 횟수: ${$correctRate[problem[curProblemNum]][0]}\n정답률: ${$correctRate[problem[curProblemNum]][1] == 0 ? 0 : ($correctRate[problem[curProblemNum]][0] / $correctRate[problem[curProblemNum]][1] * 100).toFixed(1)}%`)
            }>
        </div>

        <div id="ans-container">
            <div id="txt-container" style="font-size: 1.4rem;">
                {#if isNormal}
                    {#if $withKita}
                        봇붕쿤! 맞춰보세요~! 틀려도 괜찮으니까 너무 부담 갖지 말고요!
                    {:else if $withRyo}
                        …뭐, 맞추든 말든 네 맘이긴 한데. 그래도 한 번 해보지 그래?
                    {:else if $withBocchi}
                        아, 아… 봇붕쿤이라면, 분명… 맞출 수 있을 거야…! 어, 어서 해봐…!
                    {:else}
                        괜찮아. 봇붕쿤! 한 번 맞춰봐, 내가 옆에서 도와줄게!
                    {/if}
                {:else if isCorrect}
                    {#if $withKita}
                        와! 맞췄어! 역시 대단하다~! 봇붕쿤 진짜 멋져~!
                    {:else if $withRyo}
                        …오, 맞췄네. 뭐, 잘했어. 생각보다 괜찮은데?
                    {:else if $withBocchi}
                        우, 우와…! 맞췄어?! 봇붕쿤… 정말 대단해…! 
                    {:else}
                        우와! 역시~! 봇붕쿤이라면 할 줄 알았어! 대단해~!
                    {/if}
                {:else if isIncorrect}
                    {#if $withKita}
                        틀려도 괜찮아! 다음엔 잘할 거야! 화이팅~!
                    {:else if $withRyo}
                        …틀렸네. 뭐, 그럴 수도 있지. 다음엔 제대로 해보자.
                    {:else if $withBocchi}
                        아, 아… 틀렸구나… 그, 그래도 괜찮아! 다음엔 꼭 맞출 거야…!
                    {:else}
                        아, 아쉽다! 괜찮아, 다음엔 꼭 맞출 거야! 내가 응원할게!
                    {/if}   
                {:else if isEnd}
                    {#if $withKita}
                        우와! 전부 다 맞췄다니! 진짜 최고야~! 봇붕쿤 정말 멋지다, 나도 배워야겠어!
                    {:else if $withRyo}
                        …전부 다 맞췄어? 뭐, 예상한 대로네. 잘했어. 대단한데?
                    {:else if $withBocchi}
                        정, 정말… 전부 맞췄다니…! 믿을 수가 없어…! 봇붕쿤, 진짜 대단해…!
                    {:else}
                        모든 문제를 다 맞췄다니! 봇붕쿤 진짜 천재네~! 완전 멋져!
                    {/if}   
                {/if}
            </div>

            <div id="img-container">
                {#if isNormal}
                    {#if $withKita}
                        <img alt="" src="images/kita/normal.png">
                    {:else if $withRyo}
                        <img alt="" src="images/ryo/normal.png">
                    {:else if $withBocchi}
                        <img alt="" src="images/bocchi/normal.png">
                    {:else}
                        <img alt="" src="images/nijika/normal.png">
                    {/if}
                {:else if isCorrect || isEnd}
                    {#if $withKita}
                        <img alt="" src="images/kita/correct.png">
                    {:else if $withRyo}
                        <img alt="" src="images/ryo/correct.png">
                    {:else if $withBocchi}
                        <img alt="" src="images/bocchi/correct.png">
                    {:else}
                        <img alt="" src="images/nijika/correct.png">
                    {/if}
                {:else if isIncorrect} 
                    {#if $withKita}
                        <img alt="" src="images/kita/incorrect.png">
                    {:else if $withRyo}
                        <img alt="" src="images/ryo/incorrect.png">
                    {:else if $withBocchi}
                        <img alt="" src="images/bocchi/incorrect.png">
                    {:else}
                        <img alt="" src="images/nijika/incorrect.png">
                    {/if}
                {/if}
            </div>
        </div>
    </div>

    <div id="footer">
        <div id="left-btn-container">
            <button on:click={goPrev}> ← 이전</button>
            <button on:click={()=>{grading(1)}}>1번</button>
            <button on:click={()=>{grading(2)}}>2번</button>
            <button on:click={()=>{grading(3)}}>3번</button>
            <button on:click={()=>{grading(4)}}>4번</button>
            <button on:click={goNext}>다음 →</button>
        </div>

        <div id="right-btn-container">
            {#if !$favorites[curProblemNum]}
                <button style="width: 10vw;" on:click={addFavorites}>즐겨찾기 추가</button>
            {:else}
                <button style="width: 10vw;" on:click={removeFavorites}>즐겨찾기 삭제</button>
            {/if}

            {#if $withKita}
                <button on:click={changePartner}>료와 함께하기</button>
            {:else if $withRyo}
                <button on:click={changePartner}>봇치와 함께하기</button>
            {:else if $withBocchi}
                <button on:click={changePartner}>니지카와 함께하기</button>
            {:else if $withNijika}
                <button on:click={changePartner}>키타와 함께하기</button>
            {/if}
        </div>
    </div>
</main>
  
<style>

</style>