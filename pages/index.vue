<template>
  <div class="root-full-container dark-mode">
    <div class="root-boxed-container">
      <Sidebar />
      <div class="content-container">
        <Header />
        <Tasklist />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';

  export default Vue.extend({})
</script>

<style lang="scss">

  /* CSS Global Styles */

  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  /* Typography */

  $heading-xl-size: 1.5rem;
  $heading-xl-height: 1.875rem;

  $heading-l-size: 1.125rem;
  $heading-l-height: 1.4375rem;

  $heading-m-size: 0.9375rem;
  $heading-m-height: 1.1875rem;

  $heading-s-size: 0.75rem;
  $heading-s-height: 0.9375rem;
  $heading-s-spacing: 0.15rem;

  $body-l-size: 0.8125rem;
  $body-l-height: 1.4375rem;

  $body-m-size: 0.75rem;
  $body-m-height: 0.9375rem;

  $medium: 400;
  $bold: 700;


  h1 {
    font-size: $heading-xl-size;
    line-height: $heading-xl-height;
    font-weight: $bold;
  }

  h2 {
    font-size: $heading-l-size;
    line-height: $heading-l-height;
    font-weight: $bold;
  }

  h3 {
    font-size: $heading-m-size;
    line-height: $heading-m-height;
    font-weight: $bold;
  }

  h4 {
    font-size: $heading-s-size;
    line-height: $heading-s-height;
    letter-spacing: $heading-s-spacing;
    font-weight: $bold;
  }

  p {
    font-size: $body-l-size;
    line-height: $body-l-height;
    font-weight: $medium;
  }

  b {
    font-size: $body-m-size;
    line-height: $body-m-height;
    font-weight: $bold;
  }
  
  /* Colors */
  
  $color-a: hsl(242, 48%, 58%);
  $color-a-10: hsla(242, 48%, 58%, 0.1);
  $color-a-25: hsla(242, 48%, 58%, 0.25);
  $color-b: hsl(243, 100%, 82%);
  $color-c: hsl(237, 100%, 4%);
  $color-d: #20212C;
  $color-e: hsl(235, 12%, 19%);
  $color-f: hsl(236, 11%, 27%);
  $color-g: hsl(216, 15%, 57%);
  $color-h: hsl(221, 69%, 94%);
  $color-i: hsl(220, 69%, 97%);
  $color-j: hsl(0, 78%, 63%);
  $color-k: hsl(0, 100%, 80%);
  $color-white: hsl(0, 0%, 100%);

  /* Buttons */

  $button-l-radius: 24px;
  $button-s-radius: 20px;

  .button-primary-l {
    background: $color-a;
    color: $color-white;
    font-size: $heading-m-size;
    line-height: $heading-m-height;
    border-radius: $button-l-radius;

    &:hover {
      background: $color-b;
    }
  }

  .button-primary-s {
    background: $color-a;
    color: $color-white;
    font-size: $body-l-size;
    line-height: $body-l-height;
    border-radius: $button-s-radius;

    &:hover {
      background: $color-b;
    }
  }

  .button-secondary {   
    font-size: $body-l-size;
    line-height: $body-l-height;
    border-radius: $button-s-radius;
  }

  .button-destructive {
    background: $color-j;
    color: $color-white;
    font-size: $body-l-size;
    line-height: $body-l-height;
    border-radius: $button-s-radius;

    &:hover {
      background: $color-k;
    }
  }

  /* Light Mode */

  .light-mode {
    background: $color-white;

    h1, h2, h3, h4, p, b {
      color: $color-e;
    }

    .button-secondary {
      background: $color-a-10;

      &:hover {
        background: $color-a-25;
      }
    }
  }

  /* Dark Mode */

  .dark-mode {
    background: $color-e;

    h1, h2, h3, h4, p, b {
      color: $color-white;
    }

    .button-secondary {
      background: $color-white;

      &:hover {
        background: $color-white;
      }
    }
  }

  .root-full-container {
    min-width: 100vw;
    min-height: 100vh;
  }
  .root-boxed-container {
    min-height: 100vh;
    display: flex;
    max-width: 1920px;
    margin: 0 auto;
  }

  .content-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }

</style>
