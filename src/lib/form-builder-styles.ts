const formBuilderStyles = document.createElement('template');
formBuilderStyles.innerHTML = `
<style>
:host {
  border: 1px solid red;
  width: 100%;
  display: block;
  min-height: 100px;
}
</style>`;
export { formBuilderStyles };
