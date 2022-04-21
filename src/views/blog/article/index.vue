<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
      label-width="68px"
    >
      <el-form-item label="文章标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入文章标题"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章作者" prop="createdBy">
        <el-input
          v-model="queryParams.createdBy"
          placeholder="请输入文章作者"
          clearable
          style="width: 240px"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="文章标签" prop="tag">
        <el-select v-model="queryParams.tag" placeholder="文章标签" clearable>
          <el-option
            v-for="dict in tagOptions"
            :key="dict.title"
            :label="dict.title"
            :value="dict.title"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文章专题" prop="topic">
        <el-select v-model="queryParams.topic" placeholder="文章标签" clearable>
          <el-option
            v-for="dict in topicOptions"
            :key="dict.title"
            :label="dict.title"
            :value="dict.title"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="是否发布" prop="isPublished">
        <el-select
          v-model="queryParams.isPublished"
          placeholder="请选择是否发布"
          clearable
        >
          <el-option
            v-for="dict in dict.type.sys_yes_no"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['blog:article:add']"
          >新增</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['blog:article:edit']"
          >修改</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['blog:article:remove']"
          >删除</el-button
        >
      </el-col>
      <el-col :span="1.5">
        <el-popover placement="top-start" trigger="hover">
          <span>上次的同步时间为：{{ parseTime(syncTime) }}</span>
          <el-button
            slot="reference"
            type="danger"
            plain
            icon="el-icon-refresh"
            size="mini"
            @click="handleSync"
            v-hasPermi="['blog:article:remove']"
            >同步</el-button
          >
        </el-popover>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-refresh"
          size="mini"
          @click="handleForcedSync"
          v-hasPermi="['blog:article:remove']"
          >强制同步</el-button
        >
      </el-col>
      <right-toolbar
        :showSearch.sync="showSearch"
        @queryTable="getList"
      ></right-toolbar>
    </el-row>

    <el-table
      v-loading="loading"
      :data="articleList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="文章编号" align="center" prop="articleId" width="80" />
      <el-table-column
        label="文章标题"
        align="center"
        prop="title"
        :show-overflow-tooltip="true"
        width="240"
      />
      <el-table-column
        label="文章作者"
        align="center"
        prop="createdBy.name"
        :show-overflow-tooltip="true"
      />
      <el-table-column label="文章标签" align="center" prop="tag" width="300">
        <!-- <template slot-scope="scope">
          <dict-tag :options="dict.type.sys_yes_no" :value="scope.row.tag" />
        </template> -->
        <template slot-scope="scope">
          <el-tag class="notion-tag" :class="handleTagClass(tag)" v-for="tag in scope.row.tags" :key="tag.name">
            {{ tag.name }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="文章专题" align="center" prop="topic" /> -->
      <el-table-column
        label="发布时间"
        align="center"
        prop="publishedTime"
        width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.publishedTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态"
        align="center"
        key="isPublished"
        width="100"
      >
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isPublished"
            :active-value="true"
            :inactive-value="false"
            @change="handleStatusChange(scope.row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="访问数" align="center" prop="visit">
        <template slot-scope="scope">
          <span>{{ scope.row.visit || 0 }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" /> -->
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdTime"
        width="180"
      >
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createdTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['blog:article:edit']"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['blog:article:remove']"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改文章配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="文章标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="文章作者" prop="createdBy">
          <el-input v-model="form.createdBy" placeholder="请输入文章作者" />
        </el-form-item>
        <el-form-item label="文章键值" prop="articleValue">
          <el-input v-model="form.articleValue" placeholder="请输入文章键值" />
        </el-form-item>
        <el-form-item label="文章标签" prop="tag">
          <el-radio-group v-model="form.tag">
            <el-radio
              v-for="dict in dict.type.sys_yes_no"
              :key="dict.value"
              :label="dict.value"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            placeholder="请输入内容"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listArticle, getArticle, delArticle, addArticle, updateArticle, syncArticle, forcedSyncArticle } from "@/api/blog/article";
import { listTopic } from "@/api/blog/topic";
import { listTag } from "@/api/blog/tag";
export default {
  name: "Article",
  dicts: ["sys_yes_no"],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 文章表格数据
      articleList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询文章
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        title: undefined,
        createdBy: undefined,
        tag: undefined,
      },
      // 表单文章
      form: {},
      // 表单校验
      rules: {
        title: [
          { required: true, message: "文章标题不能为空", trigger: "blur" },
        ],
        createdBy: [
          { required: true, message: "文章作者不能为空", trigger: "blur" },
        ],
        articleValue: [
          { required: true, message: "文章键值不能为空", trigger: "blur" },
        ],
      },
      // 同步时间
      syncTime: "",
      // 专题选项
      topicOptions: [],
      // 标签
      tagOptions: []
    };
  },
  created() {
    this.getList();
    this.getConfigKey("blog.article.syncTime").then((response) => {
      this.syncTime = response.msg;
    });
    listTopic().then(res => {
      this.topicOptions = res.rows
    })
    listTag().then(res => {
      this.tagOptions = res.rows
    })
  },
  methods: {
    /** 查询文章列表 */
    getList() {
      this.loading = true;
      listArticle(this.addDateRange(this.queryParams, this.dateRange)).then(
        (response) => {
          this.articleList = response.rows;
          this.total = response.total;
          this.loading = false;
        }
      );
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        articleId: undefined,
        title: undefined,
        createdBy: undefined,
        articleValue: undefined,
        tag: "Y",
        remark: undefined,
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.resetForm("queryForm");
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加文章";
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map((item) => item.articleId);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const articleId = row.articleId || this.ids;
      getArticle(articleId).then((response) => {
        this.form = response.data;
        this.open = true;
        this.title = "修改文章";
      });
    },
    /** 同步按钮操作 */
    handleSync() {
      this.loading = true;
      syncArticle().then((res) => {
        this.getList();
      });
    },
    /** 强制同步按钮操作 */
    handleForcedSync() {
      this.loading = true;
      forcedSyncArticle().then((res) => {
        this.getList();
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.articleId != undefined) {
            updateArticle(this.form).then((response) => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addArticle(this.form).then((response) => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const articleIds = row.articleId || this.ids;
      this.$modal
        .confirm('是否确认删除文章编号为"' + articleIds + '"的数据项？')
        .then(function () {
          return delArticle(articleIds);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    // 文章状态修改
    handleStatusChange(row) {
      let text = row.status === "0" ? "启用" : "停用";
      this.$modal
        .confirm('确认要"' + text + '""' + row.userName + '"用户吗？')
        .then(function () {
          return changeUserStatus(row.userId, row.status);
        })
        .then(() => {
          this.$modal.msgSuccess(text + "成功");
        })
        .catch(function () {
          row.status = row.status === "0" ? "1" : "0";
        });
    },
    // 动态获得标签样式
    handleTagClass(tag) {
      return `notion-${tag.color}`
    },
  },
};
</script>
