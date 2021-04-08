<template>
  <div> 
        <!-- 面包屑导航 -->
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>数据统计</el-breadcrumb-item>
            <el-breadcrumb-item>数据报表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
            <div id="main" style="width: 750px;height:400px;"></div>
        </el-card>
  </div>
</template>
 
<script>
    import * as echarts from 'echarts';
    export default {
            data () {
                return {
                    option: {
                        title: {
                            text: '用户来源'
                        },
                        tooltip: {},
                        legend: {
                            data:['销量']
                        },
                        xAxis: {
                            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
                        },
                        yAxis: {},
                        series: [{
                            name: '销量',
                            type: 'bar',
                            data: [5, 20, 36, 10, 10, 20]
                        }]
                    },
                }
            },
            created () {},
            // 页面数据挂载完成, 渲染图标
            async mounted () {
                // 基于准备好的dom，初始化echarts实例
                var myChart = echarts.init(document.getElementById('main'));
            

                const {data: res} = await this.$http.get('reports/type/1');
                if (res.meta.status !== 200) return this.$message.error('获取图形数据失败')

                const result = Object.assign(this.option, res.data)
                console.log(result)
                // 使用刚指定的配置项和数据显示图表。
                myChart.setOption(result);
            },
            methods: {
                    
            },
    }
</script>
 
 
<style lang="less" scoped>
 
</style>