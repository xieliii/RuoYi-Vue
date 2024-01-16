export default {
  companyNatureMap:{
    1: '国有企业',
    2: '私营企业',
    3: '外资企业',
    4: '境外企业',
    5: '内部供应商'
  },
  companyNatureOptions:[
    { value: 1, label: '国有企业' },
    { value: 2, label: '私营企业' },
    { value: 3, label: '外资企业' },
    { value: 4, label: '境外企业' },
    { value: 5, label: '内部供应商' }
  ],
  supplierCategoryMap:{
    1: '货源供应商',
    2: '潜在供应商',
    3: '获批供应商'
  },
  supplierCategoryOptions:[
    { value: 1, label: '货源供应商', disabled: true },
    { value: 2, label: '潜在供应商' },
    { value: 3, label: '获批供应商' }
],
  levelOptions:[
    { value: 0, label: '未定' },
    { value: 1, label: '一级' },
    { value: 2, label: '二级' },
    { value: 3, label: '三级' }
  ],
  qualityOptions:[
    { value: 0, label: '不合格' },
    { value: 1, label: '合格' },
    { value: 2, label: '未评' }
  ],
  productKind:[
    { value: 1, label: '产品' },
    { value: 2, label: '服务' }
  ],
  supplierType:[
    { value: 1, label: 'Ⅰ类' },
    { value: 2, label: 'Ⅱ类' },
    { value: 3, label: 'Ⅲ类' },
    { value: 4, label: 'Ⅳ类包含设计' },
    { value: 5, label: 'Ⅳ类不包含设计' },
    { value: 6, label: 'Ⅴ类包含设计' },
    { value: 7, label: 'Ⅴ类不包含设计' },
  ],
  approveChoice:[
    { value: 1, label: '通过' },
    { value: 0, label: '不通过' }
  ],
  yesOrNo:[
    { value: 1, label: '是' },
    { value: 0, label: '否' }
  ],
  supplierManageDept: 2,
}
