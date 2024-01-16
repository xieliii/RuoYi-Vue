<template>
  <supplier-table :flag="flag"/>
</template>

<script>
import supplierTable from './components/supplierTable'
export default {
  name: 'potential',
  components:{
    supplierTable
  },
  data(){
    return{
      flag: 2,
    }
  },
  methods:{
  }
}
</script>

<style scoped>

</style>
