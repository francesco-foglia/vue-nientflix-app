<template>
  <div class="fixed top-0 left-0 z-[1] w-full h-screen bg-[#242424] flex justify-center items-center">
    <span class="loader"></span>
  </div>
</template>

<style scoped>
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #FFF;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
  }

  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
