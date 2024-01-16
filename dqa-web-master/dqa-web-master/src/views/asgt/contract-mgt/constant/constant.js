export default {
  contractStatusOptions:[
    {value: 1, label: '待生效'},
    {value: 2, label: '履约中'},
    {value: 3, label: '已过期'},
    {value: 4, label: '已解约'}
  ],
  contractStatusMap:{
    1: '待生效',
    2: '履约中',
    3: '已过期',
    4: '已解约'
  },
  supplierType:[
    { value: 1, label: 'Ⅰ类' },
    { value: 2, label: 'Ⅱ类' },
    { value: 3, label: 'Ⅲ类' },
    { value: 4, label: 'Ⅳ类包含设计' },
    { value: 5, label: 'Ⅳ类不包含设计' },
    { value: 6, label: 'Ⅴ类包含设计' },
    { value: 7, label: 'Ⅴ类不包含设计' },
  ],
}
