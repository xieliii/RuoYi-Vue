export default {
  sourceProcessKey: 'SourceSupplierEntryProcess',
  potentialProcessKey: 'poentialSupplierEntryProcess',
  approvedProcessKey: 'approvedSupplierEntryProcess',
  RFI: 'RFI',
  RFP: 'RFP',
  clearProcessKey: 'supplierClearProcess',
  changeProcessKey: 'SupplierModificationProcess',


  processKeyList:[
    // { processKey: 'SupplierModificationProcess', name: '供应商信息变更流程'},
    { processKey: 'supplierClearProcess', name: '供应商清退流程'},
    // { processKey: '', name: ''},
    { processKey: 'poentialSupplierEntryProcess', name: '潜在入册需求申请流程'},
    { processKey: 'approvedSupplierEntryProcess', name: '获批入册需求申请流程'},
    // { processKey: 'RFI', name: ''},
    // { processKey: 'RFP', name: ''},
    // { }
  ],

  allSuppliers: 0,
  sourceSupplier: 1,
  potentialSupplier: 2,
  approvedSupplier: 3,
}
