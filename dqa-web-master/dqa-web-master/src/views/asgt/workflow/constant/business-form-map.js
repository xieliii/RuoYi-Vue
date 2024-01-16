import ClearForm from '../components/clearForm'
import PotentialAddForm from '../components/potentialForm'
import ApprovedAddForm from '../components/approvedForm'
import ChangeForm from '@/views/asgt/record-mgt/components/changeForm'
import SourceForm from '@/views/asgt/workflow/components/sourceForm'

import { getApprovedByProcessInstanceId, getPotentialByProcessInstanceId } from '@/api/asgt/supplier/requirement'
import { getClearByProcessInstanceId } from '@/api/asgt/recordMgt/clearRecord'
import { getChangeByProcessInstanceId, getSupplierByProcessInstanceId } from '@/api/asgt/recordMgt/changeRecord'
export default {
  componentMap: {
    //RFI审批流程，流程键映射
    RFI: ApprovedAddForm,
    // RFP审批流程
    RFP: ApprovedAddForm,
    // RFQ处理流程
    RFQ: ApprovedAddForm,
    // 供应商信息变更流程
    SupplierModificationProcess: ChangeForm,
    // 供应商清退流程
    supplierClearProcess: ClearForm,
    // 机载产品潜在供应商入册申请流程
    poentialSupplierEntryProcess: PotentialAddForm,
    // 机载产品获批供应商入册申请流程
    approvedSupplierEntryProcess: ApprovedAddForm,
    // 货源供应商入册流程
    SourceSupplierEntryProcess: SourceForm,
  },
  requestMap:{
    //RFI审批流程，流程键映射
    RFI: getApprovedByProcessInstanceId,
    // RFP审批流程
    RFP: getApprovedByProcessInstanceId,
    // RFQ处理流程
    RFQ: getApprovedByProcessInstanceId,
    // 供应商信息变更流程
    SupplierModificationProcess: getChangeByProcessInstanceId,
    // 供应商清退流程
    supplierClearProcess: getClearByProcessInstanceId,
    // 机载产品潜在供应商入册申请流程
    poentialSupplierEntryProcess: getPotentialByProcessInstanceId,
    // 机载产品获批供应商入册申请流程
    approvedSupplierEntryProcess: getApprovedByProcessInstanceId,
    // 货源供应商入册流程
    SourceSupplierEntryProcess: getSupplierByProcessInstanceId,
  }

}
