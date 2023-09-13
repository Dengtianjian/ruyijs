<template>
  <div class="r-space"
    :style="`justify-content:${justify};align-items:${align};flex-wrap:${wrap};gap:${gap};column-gap:${columnGap};row-gap:${rowGap}`">
    <slot />
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{
  justify?: 'start' | 'end' | 'center' | 'space-around' | 'space-between' | 'space-evenly',
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch',
  wrap?: "nowrap" | "wrap" | "wrap-reverse" | string,
  gap?: number | string,
  rowGap?: number | string,
  columnGap?: number | string
}>(), {
  justify: "start",
  align: "start",
  warp: "nowrap",
  gap: "unset",
  rowGap: "unset",
  columnGap: 'unset'
});
</script>

<style scoped>
.r-space {
  display: flex;

}
</style>