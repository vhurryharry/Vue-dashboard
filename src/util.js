export default {
  getComponentName(state, componentId){
    return state.components.filter(
      component => component.id === componentId)[0].name
  }
}
