<template>
  <supplier-table :flag="flag" />
</template>

<script>
import supplierTable from './components/supplierTable'
export default {
  name: 'approved',
  components:{
    supplierTable
  },
  data(){
    return{
      flag: 3,
    }
  }
}
</script>

<style scoped>

</style>
