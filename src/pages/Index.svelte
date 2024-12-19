<script>
    import { push } from "svelte-spa-router";
    import { problemCnt, solveProblemCnt, favorites, favoritesCnt, 
             correctRate, answer, withKita, withRyo, withBocchi, withNijika} from "../lib/store";
    import { onMount } from "svelte";

    const charName = ['kita', 'ryo', 'bocchi', 'nijika'];
    const charType = ['home', 'normal', 'correct', 'incorrect'];

    $: charUrls = charName.flatMap((name) => charType.map((type) => `images/${name}/${type}.png`));
    $: problemUrls = [...Array(268).keys()].map((key) => `images/problem/${key}.PNG`);
    $: preloadImageUrls = ["images/band.png", ...charUrls, ...problemUrls];

    const resetData = async () => {
        localStorage.clear();
        await initFavorites();
        await initCorrectRate();

        alert("데이터 파일이 초기화되었습니다");
    };

    const initFavorites = async () => {
        // favorites의 초기화 파일에서 데이터 가져옴    
        let fromFile = await fetch('dataFile/favorites.txt'); 
        let data = await fromFile.text();

        // local storage의 favorites, favoritesCnt 초기화
        localStorage.setItem('favorites', JSON.stringify(data.split('\n').map(n => n.trim()).map(n => parseInt(n, 10))));
        let favoritesData = localStorage.getItem('favorites');
        $favorites = JSON.parse(favoritesData);
        $favoritesCnt = 0;
    };

    const initCorrectRate = async () => {
        // correctRate의 초기화 파일에서 데이터 가져옴
        let fromFile = await fetch('dataFile/correctRate.txt'); 
        let data = await fromFile.text();

        // local storage의 correctRate 초기화
        localStorage.setItem('correctRate', JSON.stringify(data.split('\n').map(n => n.trim()).map(line => line.split(' ').map(Number))));
        let correctRateData = localStorage.getItem('correctRate');
        $correctRate = JSON.parse(correctRateData);
    };

    const getData = async () => {
        // get answer 
        let response = await fetch('dataFile/answer.txt'); 
        let text = await response.text();
        $answer = text.split('\n').map(n => n.trim()).map(n => parseInt(n, 10)) 

        // get favorites        
        let favoritesData = localStorage.getItem('favorites');
        if(favoritesData) {
            $favorites = JSON.parse(favoritesData);
        }
        else {
            await initFavorites();
        }

        // get favoritesCnt
        let tmp = 0
        $favorites.forEach(element => {
            if(element == 1) {
                tmp++;
            }
        });

        $favoritesCnt = tmp;

        // get correctRate
        let correctRateData = localStorage.getItem('correctRate');
        if(correctRateData) {
            $correctRate = JSON.parse(correctRateData);
        }
        else {
            await initCorrectRate();
        }
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

    onMount(() => {
        getData();
    })
</script>
  
<!-- https://snippets.khromov.se/preloading-images-in-svelte/ -->
<svelte:head>
    {#each preloadImageUrls as image}
        <link rel="preload" as="image" href={image} />
    {/each}
</svelte:head>

<main>
    <div id="header">
        <div id="home-container" style="font-size: 2.6rem; color: black; font-weight: bold">
            <u>데이터<span style="color: yellow;">localStorage</span>에저장했으니<br>
                <span style="color: orange;">동일한</span>
                <span style="color: blue;">PC,</span>
                <span style="color: hotpink;">브라우저(시크릿모드x),</span>
                <span style="color: #F7D358;">도메인으로</span>
                <span style="color: black;">접속바람.</span>
            </u>
        </div>

        <div id="cnt-container" style="font-size: 3rem; color: black; font-weight: bold">
            <u><em>문제풀다가새로고침누르면<span style="color: red;">홈</span>으로감.조심.</em></u>
        </div>
    </div>

    <div id="main-container">
        <div id="problem-container">
            <img alt="" src="images/band.png">
        </div>

        <div id="ans-container">
            <h1 style="font-size: 6rem; color: green">
                <em><span style="color: red;">봇</span></em>
                <em><span style="color: blue;">치</span></em>
                <em><span style="color: hotpink;">더</span></em>
                <em><span style="color: #F7D358;">록</span></em>
                공부법으로
                <span style="color: black;">컴퓨터정보처리</span>
                <span style="color: red;">A+</span>
                <u style="color: #D4A017;">쟁취</u>하자
            </h1>
        </div>
    </div>

    <div id="footer">
        <div id="left-btn-container">
            <button on:click={()=> { $solveProblemCnt = 10; push('/solve')}}>10개 풀기</button>
            <button on:click={()=> { $solveProblemCnt = 50; push('/solve')}}>50개 풀기</button>
            <button on:click={()=> { $solveProblemCnt = 100; push('/solve')}}>100개 풀기</button>
            <button on:click={()=> { $solveProblemCnt = 7777; push('/solve')}}>전부 풀기(순서)</button>
            <button on:click={()=> { $solveProblemCnt = $problemCnt; push('/solve')}}>전부 풀기(랜덤)</button>
            <button on:click={()=> { $solveProblemCnt = 9999; push('/solve')}}>정답률 하위 30개 풀기</button>
            <button on:click={()=> { 
                if($favoritesCnt > 0) {
                    $solveProblemCnt = 8888; 
                    push('/solve')
                }
                else {
                    alert("즐겨찾기로 설정한 문제가 없습니다")
                }
                }}>즐겨찾기 풀기</button>
        </div>

        <div id="right-btn-container">
            <button on:click={resetData}>데이터 파일 초기화</button>

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