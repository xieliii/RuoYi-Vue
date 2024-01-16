<template>
  <supplier-table :flag="flag" />
</template>

<script>
import supplierTable from './components/supplierTable'

export default {
  name: 'index',
  components:{
    supplierTable
  },
  data(){
    return{
      flag: 1,
    }
  },
  created() {
  },
  methods:{
  }
}
</script>

<style scoped>

</style>
