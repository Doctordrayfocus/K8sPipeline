<template>
  <div class="w-full col-span-full h-full" :id="`mainTerminal${terminalIndex}`"></div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, toRef, watch } from 'vue';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

export default defineComponent({
  props: {
    customClass: {
      type: String,
      default: '',
    },
    content: {
      type: String,
      default: '',
    },
  },
  name: 'BpTerminal',
  setup(props) {
    const terminal = ref<Terminal>();
    const terminalIndex = Math.random() * 1000;
    onMounted(() => {
      terminal.value = new Terminal({
        fontSize: 13,
        fontWeight: '400',
        cursorStyle: 'underline',
      });
      const terminalElement = document.getElementById('mainTerminal' + terminalIndex);
      const fitAddon = new FitAddon();
      terminal.value.loadAddon(fitAddon);
      if (terminalElement) {
        terminal.value.open(terminalElement);
        terminal.value.element?.setAttribute('class', `${terminal.value.element.getAttribute('class')} px-3 py-3 !rounded-md`);

        terminal.value.write(props.content);
        fitAddon.fit();
      }
    });

    const contentRef = toRef(props, 'content');

    watch(contentRef, () => {
      terminal.value?.write(contentRef.value);
    });

    return {
      terminalIndex,
    };
  },
});
</script>
