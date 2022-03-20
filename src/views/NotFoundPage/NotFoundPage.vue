<template>
  <section>
    <div>
      <b-icon
        icon="emoticon-sad-outline"
        type="is-white"
        custom-size="is-big"
      />
      <h1>Nada encontrado</h1>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@import "@/assets/scss/main.scss";
section {
  height: 100vh;
  display: flex;
  justify-content: center;
  background: $black-bis;
  div {
    align-self: center;
    text-align: center;
    color: $info;
    *:not(h1) {
      font-size: 4rem;
    }
    h1 {
      font-size: 3rem;
    }
  }
}
</style>

<style lang="scss">
body {
  margin: 0;
}
</style>
