<template>
  <div class="spinner-overlay">
    <span class="loader"></span>
  </div>
</template>

<style scoped>
  .spinner-overlay {
    position: fixed;
    inset: 0;
    z-index: 10;
    background-color: var(--md-bg);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .loader {
    width: 48px;
    height: 48px;
    border: 4px solid rgba(255, 255, 255, 0.15);
    border-top-color: var(--md-primary);
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 0.85s linear infinite;
  }

  @keyframes rotation {
    0%   { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>
