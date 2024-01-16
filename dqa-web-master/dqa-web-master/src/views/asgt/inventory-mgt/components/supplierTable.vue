<template>
  <div class="app-container">
    <!--头部搜索-->
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="名称" prop="supplierName">
        <el-input v-model="queryParams.supplierName" placeholder="请输入供应商名称关键字" style="width: 90%" clearable />
      </el-form-item>
      <el-form-item label="编号" prop="code">
        <el-input
          v-model="queryParams.code"
          placeholder="请输入供应商编号"
          clearable style="width: 90%"/>
      </el-form-item>
      <el-form-item v-if="flag!==3" label="所在清册" prop="category">
        <el-select v-model="queryParams.category" placeholder="请选择所在清册" clearable>
          <el-option
            v-for="dict in supplierCategoryOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
            :disabled="dict.disabled&&flag===2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="公司性质" prop="companyNature">
        <el-select v-model="queryParams.companyNature" placeholder="请选择公司性质" clearable>
          <el-option
            v-for="dict in companyNatureOptions"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <!--头部按钮-->
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button v-if="flag===1" type="primary" plain icon="el-icon-plus" size="mini" @click="addButton">新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-if="flag===2" type="primary" plain icon="el-icon-document" size="mini" @click="potentialButton">潜在入册需求申请</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button v-if="flag===3" type="primary" plain icon="el-icon-document" size="mini" @click="approvedButton">获批入册需求申请</el-button>
      </el-col>
<!--      <el-col :span="1.5">-->
<!--        <el-button type="success" plain icon="el-icon-upload2" size="mini" @click="handleImport">导入</el-button>-->
<!--      </el-col>-->
<!--      <el-col :span="1.5">-->
<!--        <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport">导出</el-button>-->
<!--      </el-col>-->
      <el-col :span="1.5">
        <el-button type="info" plain icon="el-icon-delete" size="mini" @click="clearButton" >清退</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <!--表-->
    <el-table v-loading="loading" :data="supplierList" style="position: absolute" height="calc(100vh - 270px)" @row-click="rowClick">
<!--      <el-table-column type="selection" width="55" align="center"/>-->
      <el-table-column label="序号" type="index" align="center" min-width="35" />
<!--      <el-table-column v-if="flag===3" label="项目名称" align="center" prop="projectName" min-width="100" />-->
      <el-table-column v-if="flag!==1" label="需求名称" align="center" prop="reqName" min-width="100" />
      <el-table-column label="供应商编号" align="center" prop="code" min-width="100" :show-overflow-tooltip="true"/>
      <el-table-column label="供应商名称" align="center" prop="supplierName" min-width="100"/>
      <el-table-column label="公司性质" align="center" min-width="60">
        <template slot-scope="scope">
          <span>{{companyNatureMap[scope.row.companyNature]}}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="flag===1" label="货源入册时间" align="center" prop="sourceTime" min-width="120" />
      <el-table-column v-if="flag===2" label="潜在入册时间" align="center" prop="potentialTime" min-width="120" />
      <el-table-column v-if="flag===3" label="获批入册时间" align="center" prop="approveTime" min-width="120" />
      <el-table-column label="业务描述" prop="businessDescription" min-width="180" />
      <el-table-column label="所在清册" align="center" min-width="150">
        <template slot-scope="scope">
          <span>{{supplierCategoryMap[scope.row.category]}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="150">
        <!--        class-name="small-padding fixed-width"-->
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click.native.stop="handleChange(scope.row)"
          >发起变更流程</el-button>
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-delete"-->
<!--            @click.native.stop="handleDelete(scope.row)"-->
<!--          >删除</el-button>-->
        </template>
      </el-table-column>
    </el-table>
    <pagination
      style="position: fixed; bottom: 15px; right: 15px;"
      :total="total"
      :page.sync="pageNum"
      :limit.sync="pageSize"
      :page-sizes="[5,10,20,30]"
      @pagination="getList"
    />


<!--    RFI RFP RFQ表单-->
<!--    <el-dialog :visible.sync="testDia" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true">-->
<!--      <RFIForm @submitForm="getForm"/>-->
<!--    </el-dialog>-->

    <!--新增表单-->
    <el-dialog :visible.sync="addSupplier" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true" :before-close="closeRemoveDialog" >
      <div style="margin: 0 32px 40px 0;height: 120px;top: 0;" class="fix-div">
        <h1 style="margin-top: 50px;text-align: center;font-weight: bold;">货源供应商入册</h1>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="150px">
        <div style="text-align: right;font-size: 16px;margin: 0 80px 40px 0; top: 120px" class="fix-div">
          <el-form-item prop="companyId">
            入册审核单位 <el-input v-model="form.companyId" placeholder="请输入入册审核单位" style="width: 18%"/>
          </el-form-item>
        </div>
        <div style="position: relative;top: 120px">
          <el-card shadow="always" style="margin: 10px 30px 20px 30px">
            <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
            <el-row>
              <el-col :span="8">
                <el-form-item label="供应商名称" prop="supplierName">
                  <el-input v-model="form.supplierName" placeholder="请输入供应商名称" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商编号" prop="code">
                  <el-input v-model="form.code" placeholder="请输入供应商编号" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="控股公司名称" prop="holdingCompany">
                  <el-input v-model="form.holdingCompany" placeholder="请输入控股公司名称" style="width: 80%"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="商业注册号" prop="businessNum">
                  <el-input v-model="form.businessNum" placeholder="请输入商业注册号" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="成立时间" prop="establishDate">
                  <el-date-picker v-model="form.establishDate" placeholder="请选择成立时间" style="width: 80%" type="date"
                                  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="法人姓名" prop="juristicPersonName">
                  <el-input v-model="form.juristicPersonName" placeholder="请输入法人姓名" style="width: 80%"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="注册资本(万元)" prop="registeredCapital">
                  <el-input v-model="form.registeredCapital" type="number" placeholder="请输入注册资本（万元）" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="公司性质" prop="companyNature">
                  <el-select v-model="form.companyNature" placeholder="请选择公司性质" style="width: 80%">
                    <el-option v-for="item in companyNatureOptions" :value="item.value" :key="item.value" :label="item.label"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="注册地址" prop="registeredAddress">
                  <el-input v-model="form.registeredAddress" placeholder="请输入注册地址" style="width: 80%"/>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="竞争优势" prop="advantage">
                  <el-input v-model="form.advantage" placeholder="请输入竞争优势" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="业务描述" prop="businessDescription">
                  <el-input v-model="form.businessDescription" placeholder="请输入业务描述" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="等级" prop="level">
                  <el-select v-model="form.level" placeholder="请选择等级" style="width: 80%">
                    <el-option v-for="item in levelOptions" :value="item.value" :key="item.value" :label="item.label"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="合格评定" prop="isQualified">
                  <el-select v-model="form.isQualified" placeholder="请选择合格评定" style="width: 80%">
                    <el-option v-for="item in qualityOptions" :value="item.value" :key="item.value" :label="item.label"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="合格有效期" prop="qualifiedDate">
                  <el-date-picker v-model="form.qualifiedDate" type="date" placeholder="请选择合格有效期"
                                  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="供应商状态" prop="status">
                  <el-input v-model="form.status" placeholder="请输入供应商状态" style="width: 80%"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <el-card shadow="always" style="margin: 10px 30px 10px 30px;">
            <h3 style="margin-bottom: 20px;font-weight: bold">财务信息</h3>
            <el-row>
              <el-col :span="8">
                <el-form-item label="会计年度开始日期" label-width="150px" prop="fiscalStartDate">
                  <el-date-picker v-model="form.fiscalStartDate" type="date" placeholder="请选择会计年度开始日期"
                                  format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 80%"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="银行综合资信证明" label-width="150px" prop="creditCertificateFile">
                  <oss-file-upload v-model="form.creditCertificateFile"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="营业收入额（万元）" label-width="150px" prop="lastQuarterEarn">
                  <el-input v-model="form.lastQuarterEarn" type="number" placeholder="上三个月会计年度经审计的营业收入额" style="width: 80%"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
          <!--联系人-->
          <el-card shadow="always" style="margin: 10px 30px 10px 30px;">
            <h3 style="margin-bottom: 20px;font-weight: bold">联系人信息</h3>
            <el-form ref="contactForm" label-width="15px" style="padding-left: 20px">
              <el-form-item
                v-for="(domain, index) in contactInfo"
                :label="index+1 +'.'"
                :key="index">
                <el-row>
                  <el-col :span="4">
                    联系人   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.name" placeholder="请输入联系人姓名" clearable/>
                  </el-col>
                  <el-col :span="3">
                    职位   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.position" placeholder="请输入职位" clearable/>
                  </el-col>
                  <el-col :span="4">
                    电话   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.phone" placeholder="请输入电话" maxlength="12" show-word-limit />
                  </el-col>
                  <el-col :span="4">
                    手机   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.telephone" placeholder="请输入手机" maxlength="11" show-word-limit/>
                  </el-col>
                  <el-col :span="4">
                    邮箱   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.email" placeholder="请输入邮箱" clearable/>
                  </el-col>
                  <el-col :span="3">
                    传真   <el-input style="width: 75%;display: inline-block" :rows="1" v-model.number="domain.fax" placeholder="请输入传真" clearable/>
                  </el-col>
                  <el-col :span="2">
                    <el-button style="position: absolute;right: 45px" @click.prevent="removeContact(domain)" icon="el-icon-delete" type="danger" circle></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div style="margin-top: 40px;"><el-divider ><el-button icon="el-icon-plus" @click="addContact" size="small" circle plain /></el-divider></div>
            </el-form>
          </el-card>
          <!--业务-->
          <el-card shadow="always" style="margin: 10px 30px 10px 30px;">
            <h3 style="margin-bottom: 20px;font-weight: bold">业务信息</h3>
            <el-form ref="businessForm" label-width="15px" style="padding-left: 20px">
              <el-form-item
                v-for="(domain, index) in businessInfo"
                :label="index+1 +'.'"
                :key="index">
                <el-row>
                  <el-col :span="7">
                    飞机制造商客户   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.customer" placeholder="飞机制造商客户" clearable />
                  </el-col>
                  <el-col :span="7">
                    在研民机项目   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.aircraftProjects" placeholder="请输入在研民机项目" clearable />
                  </el-col>
                  <el-col :span="7">
                    分包商   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.subcontractor" placeholder="请输入分包商" clearable />
                  </el-col>
                  <el-col :span="3">
                    <el-button style="position: absolute;right: 45px" @click.prevent="removeBusiness(domain)" icon="el-icon-delete" type="danger" circle></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div style="margin-top: 40px"><el-divider><el-button icon="el-icon-plus" @click="addBusiness" size="small" circle plain /></el-divider></div>
            </el-form>
          </el-card>
          <!--产品-->
          <el-card shadow="always" style="margin: 10px 30px 10px 30px;">
            <h3 style="margin-bottom: 20px;font-weight: bold">产品信息</h3>
            <el-form ref="productForm" label-width="15px" style="padding-left: 20px">
              <el-form-item
                v-for="(domain, index) in productInfo"
                :label="index+1 +'.'"
                :key="index">
                <el-row>
                  <el-col :span="4">
                    产品/服务   <el-select v-model="domain.kindCode" placeholder="请选择产品/服务" style="width: 65%">
                    <el-option v-for="item in productKind" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                  </el-col>
                  <el-col :span="4">
                    名称   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.name" placeholder="请输入产品/服务名称"></el-input>
                  </el-col>
                  <el-col :span="4">
                    产品唯一   <el-input style="width: 65%;display: inline-block" :rows="1" v-model="domain.productUnique" placeholder="请输入产品唯一" clearable />
                  </el-col>
                  <el-col :span="3">
                    型号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.productModel" placeholder="请输入型号" clearable/>
                  </el-col>
                  <el-col :span="4">
                    供应商类别   <el-select v-model="domain.supplierType" placeholder="请选择供应商类别" style="width: 65%" clearable>
                    <el-option v-for="item in supplierType" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                  </el-col>
                  <el-col :span="3">
                    <div style="margin-left: 12px">
                      <el-row>
                        <el-col :span="10"><span>取证情况</span></el-col>
                        <el-col :span="14"><oss-file-upload v-model="domain.fileId"/></el-col>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="1">
                    <el-button style="position: absolute;right: 45px" @click.prevent="removeProduct(domain)" icon="el-icon-delete" type="danger" circle></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div style="margin-top: 40px"><el-divider><el-button icon="el-icon-plus" @click="addProduct" size="small" circle plain /></el-divider></div>
            </el-form>
          </el-card>
          <!--认证-->
          <el-card shadow="always" style="margin: 10px 30px 10px 30px;">
            <h3 style="margin-bottom: 20px;font-weight: bold">认证信息</h3>
            <el-form ref="authorityForm" label-width="20px" style="padding-left: 20px">
              <el-form-item
                v-for="(domain, index) in authorityInfo"
                :label="index+1 +'.'"
                :key="index">
                <el-row>
                  <el-col :span="4">
                    认证标准   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.standard" placeholder="例如ASE AS9100, ISO 9001等" clearable />
                  </el-col>
                  <el-col :span="4">
                    证书编号   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.certificateNo" placeholder="请输入证书编号" clearable />
                  </el-col>
                  <el-col :span="4">
                    认证范围   <el-input style="width: 73%;display: inline-block" :rows="1" v-model="domain.certificationScope" placeholder="请输入认证范围" clearable />
                  </el-col>
                  <el-col :span="6">
                    有效期   <el-date-picker v-model="domain.validityStartTime" type="date" placeholder="有效开始日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" style="width: 40%"/>
                    - <el-date-picker v-model="domain.validityEndTime" type="date" placeholder="有效结束日期" format="yyyy年MM月dd日" value-format="yyyy-MM-dd" style="width: 40%"/>
                  </el-col>
                  <el-col :span="4">
                    <div style="margin-left: 12px">
                      <el-row>
                        <el-col :span="7"><span>认证资料</span></el-col>
                        <el-col :span="8"><oss-file-upload v-model="domain.fileId"/></el-col>
                      </el-row>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <el-button style="position: absolute;right: 45px" @click.prevent="removeAuthority(domain)" icon="el-icon-delete" type="danger" circle></el-button>
                  </el-col>
                </el-row>
              </el-form-item>
              <div style="margin-top: 40px"><el-divider><el-button icon="el-icon-plus" @click="addAuthority" size="small" circle plain /></el-divider></div>
            </el-form>
          </el-card>
          <flow-chart :flow-data="flowData" v-loading="flowLoading"/>
          <div style="position: absolute;right: 0;padding: 15px 20px 40px 20px">
            <el-button type="primary" @click="handleAdd">创 建</el-button>
            <el-button @click="cancel">取 消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
    <!--清退表单-->
    <el-dialog :visible.sync="removeSupplier" width="60%" append-to-body :fullscreen="true">
      <h1 style="text-align: center;margin: 0 0 40px 0;">清退审批表</h1>
      <flow-launch :process-key="processKey" :selector-list="selectorList" :business-form="ClearForm" @close="closeDialog"/>
    </el-dialog>

<!--    <el-dialog :visible.sync="removeSupplier" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true" :before-close="closeRemoveDialog">-->
<!--      <div style="height: 100%">-->
<!--        <div style="margin: 0 40px 0 40px;">-->
<!--          <h1 style="text-align: center;font-weight: bold;">供应商清退审批表</h1>-->
<!--          <el-row>-->
<!--            <el-col :span="12">-->
<!--              <div style="margin: 12px">-->
<!--                <el-row>-->
<!--                  <el-col :span="7.5">-->
<!--                    <el-button icon="el-icon-plus" @click="addRemoveSupplier" type="primary" size="small" plain>插入行</el-button>-->
<!--                    <el-button icon="el-icon-check" @click="submitRemoveSupplier" type="success" size="small" plain>提交</el-button>-->
<!--                  </el-col>-->
<!--                  <el-col :span="8">-->
<!--                    <supplier-multiple-select :button-style="'margin-left: 10px'" :supplier-list="selectorList" :exist-ids="removeIds" @getSupplierInfo="multipleRemove"/>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </div>-->
<!--            </el-col>-->
<!--            <el-col :span="12">-->
<!--              <div style="text-align: right;font-size: 18px; margin: 10px 25px">-->
<!--                <el-row>-->
<!--                  <el-col :span="17">-->
<!--                    <div style="text-align: right;font-size: 16px; margin-top: 5px">-->
<!--                      <span>清退凭据材料：</span>-->
<!--                    </div>-->
<!--                  </el-col>-->
<!--                  <el-col :span="7">-->
<!--                    <oss-file-upload v-model="removeFileId"/>-->
<!--                  </el-col>-->
<!--                </el-row>-->
<!--              </div>-->
<!--            </el-col>-->
<!--          </el-row>-->
<!--        </div>-->
<!--        <div style="margin: 30px 40px 0 40px">-->
<!--          <el-table :data="removeForm" :row-class-name="rowClassName" border>-->
<!--            <el-table-column label="序号" align="center" prop="xh" width="50" />-->
<!--            <el-table-column label="清退供应商名单" align="center" prop="id" min-width="200px">-->
<!--              <template slot-scope="{row,$index}">-->
<!--                <supplier-select v-model="removeForm[row.xh-1].supplierId" :input-style="'width: 90%'" :list-index="(row.xh-1)"-->
<!--                                 :supplier-list="selectorList" @getInfo="removeSelectSupplier" :disabled="true"/>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="清退说明" align="center" prop="description" min-width="400px">-->
<!--              <template slot-scope="{row,$index}">-->
<!--                <el-input v-model="removeForm[row.xh-1].description" placeholder="请输入清退说明" style="width: 90%"/>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="备注" align="center" prop="remark" min-width="280px">-->
<!--              <template slot-scope="{row,$index}">-->
<!--                <el-input v-model="removeForm[row.xh-1].remark" placeholder="请输入清退说明" style="width: 90%"/>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--            <el-table-column label="操作" align="center" min-width="100px">-->
<!--              <template slot-scope="{row,$index}">-->
<!--                <el-button-->
<!--                  size="mini"-->
<!--                  type="text"-->
<!--                  icon="el-icon-delete"-->
<!--                  @click="deleteRemoveSupplier(row)"-->
<!--                >删除</el-button>-->
<!--              </template>-->
<!--            </el-table-column>-->
<!--          </el-table>-->
<!--        </div>-->
<!--      </div>-->
<!--    </el-dialog>-->
    <!--潜在需求申请表单-->
    <el-dialog :visible.sync="potentialReq" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true" :before-close="closeRemoveDialog">
      <h1 style="text-align: center;margin: 0 0 40px 0;">潜在供应商入册-需求申请</h1>
      <el-form ref="potentialForm" :model="potentialForm" label-width="120px">
        <el-card shadow="always" style="margin: 10px 30px 20px 30px">
          <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="需求编号" prop="reqCode">
                <el-input v-model="potentialForm.reqCode" placeholder="请输入需求编号" style="width: 75%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商部门主管" prop="managerId">
                <user-selector v-model="potentialForm.managerId" placeholder="请选择供应商主管" style="width: 75%" disabled/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求名称" prop="reqName">
                <el-input v-model="potentialForm.reqName" placeholder="请输入需求名称" style="width: 75%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="供应商类别" prop="category">
                <el-select v-model="potentialForm.category" placeholder="请选择供应商类别" style="width: 75%">
                  <el-option v-for="item in supplierType" :key="item.value" :value="item.value" :label="item.label" /></el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="论证材料附件" prop="argumentationFileId">
                <oss-file-upload v-model="potentialForm.argumentationFileId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="需求来源说明" prop="sourceDescription">
            <el-input v-model="potentialForm.sourceDescription" type="textarea" placeholder="请输入需求来源说明" style="width: 93%" :autosize="{ minRows: 3 }"/>
          </el-form-item>
        </el-card>
        <el-card shadow="always" style="margin: 10px 30px 20px 30px">
          <el-row>
            <el-col :span="2">
              <h3 style="margin-bottom: 20px;font-weight: bold">供应商列表</h3>
            </el-col>
            <el-col :span="2">
              <supplier-multiple-select :button-style="'margin-top:12px'" :supplier-list="selectorList" @getSupplierInfo="potentialSelectSupplier" :exist-ids="supplierIds"/>
            </el-col>
          </el-row>
          <el-form ref="supplierInfo" label-width="15px" style="padding-left: 20px">
            <el-form-item
              v-for="(domain, index) in supplierInfo"
              :label="index+1 +'.'"
              :key="index" label-width="5px">
              <el-row>
                <el-col :span="5">
                  <el-row>
                    <el-col :span="5">
                      <span>供应商</span>
                    </el-col>
                    <el-col :span="19">
                      <supplier-select :input-style="'width: 90%'" v-model="domain.supplierId" :listIndex="index" :supplier-list="selectorList" @getInfo="potentialAddSupplier"/>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="5">
                  供应商编号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.code" placeholder="根据供应商回填" :disabled="true" clearable/>
                </el-col>
                <el-col :span="5">
                  公司性质   <el-select v-model="domain.companyNature" placeholder="根据供应商回填" style="width: 75%" :disabled="true">
                  <el-option v-for="item in companyNatureOptions" :label="item.label" :value="item.value" :key="item.value"/></el-select>
                </el-col>
                <el-col :span="7">
                  地址   <el-input style="width: 85%;display: inline-block" :rows="1" v-model="domain.registeredAddress" placeholder="根据供应商回填" :disabled="true" />
                </el-col>
                <el-button @click.prevent="removeSupplierInfo(domain)" icon="el-icon-delete" type="danger" circle style="right: 0"></el-button>
              </el-row>
            </el-form-item>
            <div style="margin-top: 40px"><el-divider><el-button icon="el-icon-plus" @click="addSupplierInfo" size="small" circle plain /></el-divider></div>
          </el-form>
        </el-card>
        <flow-chart :flow-data="flowData" v-loading="flowLoading"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handlePotentialReq">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--获批需求申请表单-->
    <el-dialog :visible.sync="approvedReq" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true" :before-close="closeRemoveDialog">
      <h1 style="text-align: center;margin: 0 0 40px 0;">获批供应商入册-需求申请</h1>
      <el-form ref="approvedForm" :model="approvedForm" label-width="120px" >
        <el-card shadow="always" style="margin: 10px 30px 20px 30px">
          <h3 style="margin-bottom: 20px;font-weight: bold">基本信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="项目编号" prop="projectCode">
                <el-input v-model="approvedForm.projectCode" placeholder="请输入项目编号" style="width: 75%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="项目名称" prop="projectName">
                <el-input v-model="approvedForm.projectName" placeholder="请输入项目名称" style="width: 75%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商类别" prop="category">
                <el-select v-model="approvedForm.category" placeholder="请选择供应商类别" style="width: 75%">
                  <el-option v-for="item in supplierType" :key="item.value" :value="item.value" :label="item.label" /></el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="需求编号" prop="reqCode">
                <el-input v-model="approvedForm.reqCode" placeholder="请输入需求编号" style="width: 75%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求交付时间" prop="reqDeliveryTime">
                <el-date-picker v-model="approvedForm.reqDeliveryTime" type="date" placeholder="请选择需求交付时间"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 75%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="需求附件" prop="fileId">
                <oss-file-upload v-model="approvedForm.fileId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="采购申请时间">
                <el-date-picker v-model="currentDate" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 75%" :disabled="true"/>
              </el-form-item>
            </el-col>
            <!--主管selector-->
            <el-col :span="8">
              <el-form-item label="供应商部门主管" prop="managerId">
                <user-selector v-model="approvedForm.managerId" placeholder="请选择供应商部门主管" style="width: 75%" disabled/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="always" style="margin: 10px 30px 20px 30px">
          <h3 style="margin-bottom: 20px;font-weight: bold">采购明细</h3>
          <el-form ref="purchaseForm" label-width="15px" style="padding-left: 20px">
            <el-form-item
              v-for="(domain, index) in purchaseInfo"
              :label="index+1 +'.'"
              :key="index">
              <el-row>
                <el-col :span="4">
                  <!--供应商selector-->
                  物品名称   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.itemName" placeholder="请输入采购物品名称" clearable />
                </el-col>
                <el-col :span="4">
                  规格型号   <el-input style="width: 70%;display: inline-block" :rows="1" v-model="domain.specificationModel" placeholder="请输入规格型号" clearable/>
                </el-col>
                <el-col :span="3">
                  数量   <el-input style="width: 70%;display: inline-block" type="number" :rows="1" v-model="domain.num" placeholder="数量" clearable/>
                </el-col>
                <el-col :span="4">
                  单价   <el-input style="width: 70%;display: inline-block" type="number" :rows="1" v-model="domain.price" placeholder="单价(元)" />
                </el-col>
                <el-col :span="2">
                  <span style="margin-left: 5px"> 物品总价 {{ itemTotal(domain.num,domain.price) }} </span>
                </el-col>
                <el-col :span="5">
                  参考供应商   <el-input style="width: 75%;display: inline-block" :rows="1" v-model="domain.referenceSupplier" placeholder="根据供应商回填"  />
                </el-col>
                <el-col :span="2">
                  <el-button @click.prevent="removePurchase(domain)" icon="el-icon-delete" type="danger" circle style="position: absolute;right: 0"></el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <div style="margin-top: 40px"><el-divider><el-button icon="el-icon-plus" @click="addPurchase" size="small" circle plain /></el-divider></div>
            <span>采购总价：{{computedTotal}} 元</span>
          </el-form>
        </el-card>
        <flow-chart :flow-data="flowData" v-loading="flowLoading"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleApprovedReq">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--信息变更表单-->
    <el-dialog :visible.sync="showChange" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true">
      <h1 style="text-align: center;font-weight: bold;">供应商信息变更</h1>
      <el-form ref="form" :model="changeForm" :rules="rules" label-width="100px">
        <div style="text-align: right;font-size: 16px;margin: 0 32px 40px 0;">
          <el-form-item prop="companyId">
            入册审核单位 <el-input v-model="changeForm.companyId" placeholder="请输入入册审核单位" style="width: 20%" :disabled="true"/>
          </el-form-item>
        </div>
        <el-card shadow="always" style="margin: 10px 30px 20px 30px">
          <h3>基本信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="供应商名称" prop="supplierName">
                <el-input v-model="changeForm.supplierName" placeholder="请输入供应商名称" style="width: 80%" :disabled="true"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商编号" prop="code">
                <el-input v-model="changeForm.code" placeholder="请输入供应商编号" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="控股公司名称" prop="holdingCompany">
                <el-input v-model="changeForm.holdingCompany" placeholder="请输入控股公司名称" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="商业注册号" prop="businessNum">
                <el-input v-model="changeForm.businessNum" placeholder="请输入商业注册号" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="成立时间" prop="establishDate">
                <el-date-picker v-model="changeForm.establishDate" placeholder="请选择成立时间" style="width: 80%" type="date"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="法人姓名" prop="juristicPersonName">
                <el-input v-model="changeForm.juristicPersonName" placeholder="请输入法人姓名" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="注册资本" prop="registeredCapital">
                <el-input v-model="changeForm.registeredCapital" type="number" placeholder="请输入注册资本（万元）" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="公司性质" prop="companyNature">
                <el-select v-model="changeForm.companyNature" placeholder="请选择公司性质" style="width: 80%">
                  <el-option v-for="item in companyNatureOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="注册地址" prop="registeredAddress">
                <el-input v-model="changeForm.registeredAddress" placeholder="请输入注册地址" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="竞争优势" prop="advantage">
                <el-input v-model="changeForm.advantage" placeholder="请输入竞争优势" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="业务描述" prop="businessDescription">
                <el-input v-model="changeForm.businessDescription" placeholder="请输入业务描述" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="等级" prop="level">
                <el-select v-model="changeForm.level" placeholder="请选择等级" style="width: 80%">
                  <el-option v-for="item in levelOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="合格评定" prop="isQualified">
                <el-select v-model="changeForm.isQualified" placeholder="请选择合格评定" style="width: 80%">
                  <el-option v-for="item in qualityOptions" :value="item.value" :key="item.value" :label="item.label"/>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="合格有效期" prop="qualifiedDate">
                <el-date-picker v-model="changeForm.qualifiedDate" type="date" placeholder="请选择合格有效期"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="供应商状态" prop="status">
                <el-input v-model="changeForm.status" placeholder="请输入供应商状态" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <el-card shadow="always" style="margin: 10px 30px 10px 30px">
          <h3>财务信息</h3>
          <el-row>
            <el-col :span="8">
              <el-form-item label="会计年度开始日期" label-width="150px" prop="fiscalStartDate">
                <el-date-picker v-model="changeForm.fiscalStartDate" type="date" placeholder="请选择会计年度开始日期"
                                format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" style="width: 80%"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="银行综合资信证明" label-width="150px" prop="creditCertificateFile">
                <oss-file-upload v-model="changeForm.creditCertificateFile"/>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="营业收入额（万元）" label-width="150px" prop="lastQuarterEarn">
                <el-input v-model="changeForm.lastQuarterEarn" type="number" placeholder="上三个月会计年度经审计的营业收入额" style="width: 80%"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
        <flow-chart :flow-data="flowData" v-loading="flowLoading"/>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitChangeForm">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--详情页面-->
    <el-dialog :visible.sync="showDetail" append-to-body style="height: calc(100vh - 0px);" :fullscreen="true">
      <supplier-detail :data="detailForm" :contact-info="detailForm.contacts" :business-info="detailForm.businessInfo"
                       :authority-info="detailForm.authenticationInfo" :product-info="detailForm.productsInfo"/>
    </el-dialog>
  </div>
</template>

<script>
import constant from '../constant/constant'
import supplierMultipleSelect from './supplierMultipleSelect'
import supplierSelect from './supplierSelect'
import { deepClone } from '../../../../utils'
import {
  listAllSupplierByPage,
  addSupplier,
  getSupplierInfo,
  editSupplierInfo,
  listAllSupplierByKind
} from '../../../../api/asgt/supplier/supplierBase'
import { addClearRecords } from '../../../../api/asgt/recordMgt/clearRecord'
import { getProcessXmlDataByKey } from '../../../../api/workflow/workflow-common'
import supplierDetail from './supplierDetail'
import RFIForm from './RFIForm'
import { startProcess } from '../../../../api/workflow/workflow-common'
import processConstant from '../../workflow/constant/constant'
import FlowChart from '../../workflow/components/flowchart'
import FlowLaunch from '../../workflow/flowLaunch'
import ClearForm from '../../workflow/components/clearForm'
import { getDept } from '@/api/system/dept'
import userSelector from '@/views/asgt/user-selector'

export default {
  name: 'supplierTable',
  components:{
    supplierSelect,
    supplierMultipleSelect,
    supplierDetail,
    RFIForm,
    FlowChart,FlowLaunch,ClearForm,
    userSelector
  },
  computed:{
    computedTotal() {
      let res = 0
      this.purchaseInfo.forEach(item=>{
        res += item.price * item.num
      })
      return res
    },
  },
  watch:{
    supplierInfo:{
      handler(val){
        val.forEach(item=>{
          if (item.supplierId!==undefined && item.supplierId!==null){
            this.supplierIds.push(item.supplierId)
          }
        })
      },
      deep: true
    },
    removeForm:{
      handler(val){
        val.forEach(item=>{
          if (item.supplierId!==undefined && item.supplierId!==null){
            this.removeIds.push(item.supplierId)
          }
        })
      },
      deep: true
    },
  },
  props:{
    flag:{
      type: Number,
      default: 1
    },
  },
  data(){
    return{
      ClearForm,
      currentDate: new Date(),
      total: 0,
      pageNum: 1,
      pageSize: 10,
      queryParams:{
        id: null,
        code: null,
        category: null,
        supplierName: null,
        companyNature: null,
      },
      supplierList: [],
      selectorList: [],
      showSearch: true,
      multiple: true,
      single: true,
      loading: true,
      // 显隐
      addSupplier: false,
      removeSupplier: false,
      potentialReq: false,
      approvedReq: false,
      showChange: false,
      showDetail: false,
      // 存放数据
      flowData: {},
      flowLoading: true,
      ids: [],
      changeForm: {},
      form: {
        supplierName: null, code: null, holdingCompany: null, businessNum: null,
        level: null, isQualified: null, qualifiedDate: null, juristicPersonName: null,
        registeredCapital: null, companyNature: null,registeredAddress: null,
        advantage: null, businessDescription: null, status: null, companyId: null,
        contactInfo: null, businessInfo: null, productInfo: null, authorityInfo: null,
      },
      potentialForm: {},
      approvedForm: {},
      supplierDTO: {},
      removeForm: [{ supplierId: null, description: null,remark: null }],
      removeIds: [],
      removeFileId: null,
      reqForm: [],
      detailForm: {},
      // 联系人信息
      contactInfo: [{name: null,position: null,phone: null,telephone: null,email: null,fax: null,}],
      // 业务信息
      businessInfo: [{customer: null,aircraftProjects: null,subcontractor: null}],
      // 主要产品信息
      productInfo: [{name: null,kindCode: null,productUnique: null,productModel: null,supplierType: null,fileId: null,}],
      // 认证信息
      authorityInfo: [{standard: null,certificateNo: null,certificationScope: null,validityStartTime: null,validityEndTime: null,fileId: null}],
      // 项目信息
      projectInfo: [],
      // 需求申请
      supplierInfo: [{id: null,code: null,companyNature: null,address: null}],
      supplierIds: [],
      // 采购明细
      purchaseInfo: [{itemName: null,specificationModel: null,num: null,price: null,referenceSupplier: null,}],
      rules:{
        supplierName: [
          { required: true, message: "供应商名称不能为空", trigger: "blur" }
        ],
        code: [
          { required: true, message: "供应商编码不能为空", trigger: "change" }
        ]
      },
      companyNatureMap: constant.companyNatureMap,
      companyNatureOptions: constant.companyNatureOptions,
      supplierCategoryMap: constant.supplierCategoryMap,
      supplierCategoryOptions: constant.supplierCategoryOptions,
      levelOptions: constant.levelOptions,
      qualityOptions: constant.qualityOptions,
      productKind: constant.productKind,
      supplierType: constant.supplierType,
      processConstant,
      processKey: ''
    }
  },
  created() {
    this.queryParams.kind = this.flag
    this.getList()
  },
  methods:{
    getList(){
      listAllSupplierByPage(this.pageNum,this.pageSize,this.queryParams).then(res=>{
        this.supplierList = res.rows
        this.total = res.total
        this.loading = false
      })
      let kind = 0
      if (this.flag===1){
        listAllSupplierByKind(this.flag-1).then(res=>{
          this.selectorList = res.data
        })
      }
      else {
        listAllSupplierByKind(kind).then(res=>{
          this.selectorList = res.data
        })
      }
    },
    handleQuery(){
      listAllSupplierByPage(this.pageNum,this.pageSize,this.queryParams).then(res=>{
        this.supplierList = res.rows
        this.total = res.total
        this.loading = false
      })
    },
    // 重置
    resetQuery(){
      this.queryParams = {
        id: null,
        kind: this.flag,
        code: null,
        category: null,
        supplierName: null,
        companyNature: null,
      }
      this.getList()
    },
    // 新增表单的创建
    handleAdd(){
      this.$refs['form'].validate(valid =>{
        for (let i=0;i<this.contactInfo.length;i++){
          if (this.contactInfo[i].phone){
            let phoneReg = /^1[3-9][0-9]{9}$/
            if (!phoneReg.test(this.contactInfo[i].phone)){
              this.$message.warning("联系人电话格式有误")
              return;
            }
          }
          if (this.contactInfo[i].telephone){
            let teleReg = /^1[3-9][0-9]{9}$/
            if (!teleReg.test(this.contactInfo[i].telephone)){
              this.$message.warning("联系人手机号码格式有误")
              return;
            }
          }
          if (this.contactInfo[i].email){
            let mailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (!mailReg.test(this.contactInfo[i].email)){
              this.$message.warning("联系人邮箱格式有误")
              return;
            }
          }
        }
        if (valid){
          this.supplierDTO = this.form
          this.supplierDTO.contactsEntities = this.contactInfo
          this.supplierDTO.businessInfoEntities = this.businessInfo
          this.supplierDTO.productsInfoEntities = this.productInfo
          this.supplierDTO.authenticationInfoEntities = this.authorityInfo

          startProcess(JSON.stringify(this.supplierDTO),processConstant.sourceProcessKey).then(res=>{
            this.addSupplier = false
            this.getList()
            this.$message.success("成功发起货源入册流程")
          })
        }
      })
    },
    // 点击行查看详情
    rowClick(row,col,event){
      this.showDetail = true
      // this.detailForm = deepClone(row)
      getSupplierInfo(row.id).then(res=>{
        this.detailForm = deepClone(res.data)
        // this.contactInfo = res.data.contacts
        // this.businessInfo = res.data.businessInfo
        // this.productInfo = res.data.productsInfo
        // this.authorityInfo = res.data.authenticationInfo
      })
    },
    // 导入
    // handleImport(){},
    // 导出
    // handleExport(){},

    // 潜在入册选择供应商列表
    potentialSelectSupplier(ids,data){
      let arr = data.map(item=>{
        return{
          supplierId: item.id,
          code: item.code,
          companyNature: item.companyNature,
          registeredAddress: item.registeredAddress
        }
      })
      // 去重
      arr = this.supplierInfo.concat(arr)
      for (let item of arr){
        let sign = true
        for (let existItem of this.supplierInfo){
          if (item.supplierId===existItem.supplierId){
            sign = false
          }
        }
        if (sign){
          this.supplierInfo.push(item)
        }
      }
    },
    potentialAddSupplier(id,data,index){
      let obj = {
        supplierId: data.id,
        code: data.code,
        companyNature: data.companyNature,
        registeredAddress: data.registeredAddress
      }
      let sign = true
      for (let item of this.supplierInfo){
        if (id===item.supplierId){
          sign = false
        }
      }
      if (sign){
        this.supplierInfo[index] = deepClone(obj)
      }
    },
    // 潜在申请表单提交按钮
    handlePotentialReq(){
      this.potentialForm.supplierList = this.supplierInfo
      startProcess(JSON.stringify(this.potentialForm), processConstant.potentialProcessKey).then(res=>{
        this.potentialReq = false
        this.$message.success("成功发起潜在需求申请流程")
      });
    },
    // 获批申请表单提交按钮
    handleApprovedReq(){
      this.approvedForm.purchaseDetailList = this.purchaseInfo
      startProcess(JSON.stringify(this.approvedForm), processConstant.approvedProcessKey).then(res=>{
        this.approvedReq = false
        this.$message.success("成功发起获批需求申请流程")
      });
    },
    // 需求变更
    handleChange(row){
      this.showChange = true
      this.changeForm = deepClone(row)
      this.flowLoading = true
      getProcessXmlDataByKey(processConstant.changeProcessKey).then(res=>{
        this.flowData = {xmlData:res.data}
      }).finally(()=>{
        this.flowLoading = false
      })
    },
    submitChangeForm(){
      this.changeForm.supplierId = this.changeForm.id
      startProcess(JSON.stringify(this.changeForm),processConstant.changeProcessKey).then(res=>{
        this.showChange = false
        this.getList()
        this.$message.success('成功发起信息变更流程')
      })
    },

    // 清退审批表
    multipleRemove(ids,data){
      let arr = data.map(item=>{
        return{
          supplierId: item.id,
        }
      })
      for (let item of arr){
        let sign = true
        for (let existItem of this.removeForm){
          if (item.supplierId===existItem.supplierId){
            sign = false
          }
        }
        if (sign){
          this.removeForm.push(item)
        }
      }
    },
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1;
    },
    addRemoveSupplier(){
      this.removeForm.push({
        supplierId: null,
        description: null,
        remark: null,
      })
    },
    deleteRemoveSupplier(item){
      let index = this.removeForm.indexOf(item)
      if (index !== -1) {
        this.removeForm.splice(index, 1)
      }
    },
    closeRemoveDialog(done){
      this.cancel()
      done();
    },
    // 提交清退审批表
    submitRemoveSupplier(){
      let flag = true
      for (let item of this.removeForm)
      {
        if(item.supplierId === null){
          flag = false
        }
      }
      if (flag){
        let data = {}
        data.supplierIdList = this.removeForm
        data.fileId = this.removeFileId
        addClearRecords(data).then(res=>{
          this.$message.success("成功发起清退流程")
          this.removeSupplier = false
        })
      }else {
        this.$message.error('清退的供应商列表不能为空')
      }
    },

    // 单选供应商
    removeSelectSupplier(id,data,index){
      let sign = true
      for (let item of this.removeForm) {
        if (id===item.supplierId){
          sign = false
        }
      }
      if (sign){
        this.removeForm[index].supplierId = id
      }
      else {
        this.removeForm[index].supplierId = null
        this.$message.error("已添加过该供应商，请重新选择")
      }
    },


    addButton(){
      this.processKey = processConstant.sourceProcessKey
      this.addSupplier = true
      this.flowLoading = true
      getProcessXmlDataByKey(processConstant.sourceProcessKey).then(res=>{
        this.flowData = {xmlData: res.data};
      }).finally(()=>{
        this.flowLoading = false
      })
    },
    potentialButton(){
      this.processKey = processConstant.potentialProcessKey
      this.potentialReq = true
      getDept(constant.supplierManageDept).then(res=>{
        if (res.data){
          this.potentialForm.managerId = res.data.manager;
        }
      })
      this.flowLoading = true
      getProcessXmlDataByKey(processConstant.potentialProcessKey).then(res=>{
        this.flowData = {xmlData: res.data};
      }).finally(()=>{
        this.flowLoading = false
      })
    },
    approvedButton(){
      this.processKey = processConstant.approvedProcessKey
      this.approvedReq = true
      getDept(constant.supplierManageDept).then(res=>{
        if (res.data){
          this.approvedForm.managerId = res.data.manager;
        }
      })
      this.flowLoading = true
      getProcessXmlDataByKey(processConstant.approvedProcessKey).then(res=>{
        this.flowData = {xmlData: res.data};
      }).finally(()=>{
        this.flowLoading = false
      })
    },
    clearButton(){
      this.processKey = processConstant.clearProcessKey
      this.removeSupplier = true
      // this.flowLoading = true
      // getProcessXmlDataByKey(processConstant.clearProcessKey).then(res=>{
      //   this.flowData = {xmlData: res.data};
      // }).finally(()=>{
      //   this.flowLoading = false
      // })
    },
    itemTotal(num,price){
      return num * price
    },
    cancel(){
      this.addSupplier = false
      this.removeSupplier = false
      this.potentialReq = false
      this.approvedReq = false
      this.showChange = false
      this.showDetail = false
      this.form = {}
      this.potentialForm = {}
      this.approvedForm = {}
      this.removeForm = [{ supplierId: null, description: null,remark: null }]
      // 联系人
      this.contactInfo = [{name: null,position: null,phone: null,telephone: null,email: null,fax: null,}]
      // 业务信息
      this.businessInfo = [{customer: null,aircraftProjects: null,subcontractor: null}]
      // 主要产品信息
      this.productInfo = [{name: null,kindCode: null,productUnique: null,productModel: null,supplierType: null,fileId: null,}]
      // 认证信息
      this.authorityInfo = [{standard: null,certificateNo: null,certificationScope: null,validityStartTime: null,validityEndTime: null,fileId: null}]
      // 需求申请
      this.supplierInfo = [{id: null,code: null,companyNature: null,address: null}]
      // 采购明细
      this.purchaseInfo = [{itemName: null,specificationModel: null,num: null,price: null,referenceSupplier: null,}]
    },
    closeDialog(dialogVisible){
      this.removeSupplier = dialogVisible
    },
    addContact() {
      this.contactInfo.push({
        name: null,
        position: null,
        phone: null,
        telephone: null,
        email: null,
        fax: null,
      })
    },
    removeContact(item) {
      let index = this.contactInfo.indexOf(item)
      if (index !== -1) {
        this.contactInfo.splice(index, 1)
      }
    },
    addBusiness() {
      this.businessInfo.push({
        customer: null,
        aircraftProjects: null,
        subcontractor: null,
      })
    },
    removeBusiness(item) {
      let index = this.businessInfo.indexOf(item)
      if (index !== -1) {
        this.businessInfo.splice(index, 1)
      }
    },
    addProduct() {
      this.productInfo.push({
        name: null,
        kindCode: null,
        productUnique: null,
        productModel: null,
        supplierType: null,
        fileId: null,
      })
    },
    removeProduct(item) {
      let index = this.productInfo.indexOf(item)
      if (index !== -1) {
        this.productInfo.splice(index, 1)
      }
    },
    addAuthority() {
      this.authorityInfo.push({
        standard: null,
        certificateNo: null,
        certificationScope: null,
        validityStartTime: null,
        validityEndTime: null,
        fileId: null,
      })
    },
    removeAuthority(item) {
      let index = this.authorityInfo.indexOf(item)
      if (index !== -1) {
        this.authorityInfo.splice(index, 1)
      }
    },
    addSupplierInfo() {
      this.supplierInfo.push({
        id: ''
      })
    },
    removeSupplierInfo(item) {
      let index = this.supplierInfo.indexOf(item)
      if (index !== -1) {
        this.supplierInfo.splice(index, 1)
      }
    },
    addPurchase(){
      this.purchaseInfo.push({
        itemName: null,
        specificationModel: null,
        num: null,
        price: null,
        referenceSupplier: null,
      })
    },
    removePurchase(item){
      let index = this.purchaseInfo.indexOf(item)
      if (index !== -1) {
        this.purchaseInfo.splice(index, 1)
      }
    },
  }
}
</script>

<style scoped>
.fix-div{
  position: fixed;
  /*left: 52px;*/
  /*right: 40px;*/
  background-color: white;
  z-index: 9999;
  width: 97%;
}
.foot-div{
  position: relative;
}
/**修改全局的滚动条*/
/**滚动条的宽度*/
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: #eaecf1;
  border-radius: 3px;
}
</style>
