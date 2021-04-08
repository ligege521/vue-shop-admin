<template>
  <div> 
       <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>订单管理</el-breadcrumb-item>
            <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 收缩框 -->
            <el-row>
                <el-col :span="8">
                    <el-input placeholder="请输入内容" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表数据 -->
            <el-table :data="orderList" bordre stripe v-loading="loading">
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number" width="250px"></el-table-column>
                <el-table-column label="订单价格" prop="order_price"></el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template v-slot="scope">
                       <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
                       <el-tag type="danger" v-else>未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template v-slot="scope">
                        <span>{{scope.row.create_time | dateFormat}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template>
                        <el-button type="primary" size="mini" 
                            icon="el-icon-edit" @click="showBox"
                        ></el-button>
                        <!-- <el-button type="success" size="mini" 
                            icon="el-icon-location" @click="showProgressBox"
                        ></el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <!-- 分页 -->
             <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 10, 15]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>

            <!-- 修改地址弹框 -->
            <el-dialog
                title="修改地址"
                :visible.sync="addressVisible"
                width="50%"
                @close="addressDialogClosed"
            >
                <el-form :model="addressForm" :rules="addressFormRules" 
                    ref="addressFormRef" label-width="100px"
                >
                    <el-form-item label="省市区/县" prop="address1">
                      <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
                    </el-form-item>
                    <el-form-item label="详细地址" prop="address2">
                        <el-input v-model="addressForm.address2"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="addressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addressVisible = false">确 定</el-button>
                </span>
            </el-dialog>


            <!-- 物流地址弹框 -->
            <!-- <el-dialog
                title="物流进度"
                :visible.sync="progressVisible"
                width="50%"
            >
                <span slot="footer" class="dialog-footer">
                    <el-button @click="progressVisible = false">取 消</el-button>
                    <el-button type="primary" @click="progressVisible = false">确 定</el-button>
                </span>
            </el-dialog> -->
        </el-card>
  </div>
</template>
 
<script>
    import cityData from './citydata'
   export default {
        data () {
            return {
                queryInfo: {
                    query: '',
                    pagenum: 1,
                    pagesize: 10
                },
                total: 0,
                loading: true,
                orderList: [],
                addressVisible: false,
                // 修改地址
                addressForm: {
                    address1: '',
                    address2: '',
                },
                addressFormRules: {
                    address1: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
                },
                // 级联选择数据
                cityData,
            }
        },
        created () {
            this.getOrderList();
        },
        methods: {
            async getOrderList () {
                let {data: res} = await this.$http.get('orders', {params: this.queryInfo});
                this.loading = false;
                if (res.meta.status !== 200) return this.$message.error('获取订单列表失败');
                this.orderList = res.data.goods;
                this.total = res.data.total;
            },
            // 分页数
            handleSizeChange (newSize) {
                this.queryInfo.pagesize = newSize;
                this.getOrderList();
            },
            // 改变分页的当前页
            handleCurrentChange (newPage) {
                this.queryInfo.pagenum = newPage;
                this.getOrderList();
            },
            // 修改地址对话框
            showBox () {
                this.addressVisible = true;
            },
            // 关闭对话框
            addressDialogClosed () {
                this.$refs
                this.$refs.addressFormRef.resetFields();
                this.addressVisible = false;
            },

            // // 物流信息
            // async showProgressBox () {
            //     this.progressVisible = true;
            //     let {data: res} = await this.$http.get(`/kuaidi/1106975712662`);
            //     if (res.meta.status !== 200) return this.$message.error('获取物流信息失败');
            //     this.progressInfo = res.data
            //     console.log(res.data)
            // }
        },
   }
</script>
 
 
<style lang="less" scoped>
    .el-cascader{
        width: 100%;
    }
</style>