

<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">阿爾比恩查價</a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDarkDropdown" aria-controls="navbarNavDarkDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDarkDropdown">
      <ul class="navbar-nav">
        <select class="form-select select-width" v-model="this.typeVal" @change="onSelectType" aria-label="纖維">
          <option value="SKILLBOOK_STANDARD">洞察之書</option>
          <option value="FIBER">纖維</option>
          <option value="CLOTH">布</option>
          <option value="ROCK">石頭</option>
          <option value="STONEBLOCK">石材</option>
          <option value="ORE">礦石</option>
          <option value="METALBAR">金屬塊</option>
          <option value="WOOD">木頭</option>
          <option value="PLANKS">木材</option>
          <option value="HIDE">獸皮</option>
          <option value="LEATHER">皮革</option>
        </select>
        <select class="form-select select-width" v-model="this.levelVal" @change="onSelectType" aria-label="4">
          <option value="T1">T1</option>
          <option value="T2">T2</option>
          <option value="T3">T3</option>
          <option value="T4">T4</option>
          <option value="T5">T5</option>
          <option value="T6">T6</option>
          <option value="T7">T7</option>
          <option value="T8">T8</option>
        </select>
        <select class="form-select select-width" v-model="this.enchantVal" @change="onSelectType">
          <option value="">附魔 0</option>
          <option value="LEVEL1@1">附魔 1</option>
          <option value="LEVEL2@2">附魔 2</option>
          <option value="LEVEL3@3">附魔 3</option>
          <option value="LEVEL4@4">附魔 4</option>
        </select>
      </ul>
    </div>
  </div>
</nav>
  </div>
<div>
<VTable :data="fields" class="table table-bordered table-striped">
    <template #head>
        <VTh sortKey="item_id">物品</VTh>
        <VTh sortKey="city">城市</VTh>
        <VTh sortKey="sell_price_min">最低售出價格</Vth>
        <th>售出時間</th>
    </template>
    <template #body="{rows}">
      <tr v-for="row in rows" :key="row.id">
        <td>{{ row.item_id }}</td>
        <td>{{ row.city }}</td>
        <td>{{ row.sell_price_min }}</td>
        <td>{{ row.sell_price_min_date }}</td>
      </tr>
    </template>
  </VTable>
</div>
</template>

<script>
import axios from 'axios';
const item_map = {
  "SKILLBOOK_STANDARD": "洞察之書",
  "FIBER": "纖維",
  "CLOTH": "布",
  "ROCK": "石頭",
  "SKILLBOOK_STANDARD": "洞察之書",
}
export default {
    data() {
      return {
        fields: [
        ],
        typeVal: "FIBER",
        levelVal: "T4",
        enchantVal: "",

      }
    },
    methods: {
      onSelectType(event){
        this.search()

      },
      search() {
            const self = this
            let params = `${this.levelVal}_${this.typeVal}`
            if (this.enchantVal !== "" && this.enchantVal !== null){
              params = `${params}_${this.enchantVal}`
            }
            if (this.typeVal === "SKILLBOOK_STANDARD"){
              params = `T4_SKILLBOOK_STANDARD`
            }
            let url = `https://east.albion-online-data.com/api/v2/stats/prices/${params}`
            axios({
                method: 'get',
                url: url,
                headers: { 
                }
            })
            .then( data => {
              console.log(data)
              this.fields = []
              this.fields = data.data.map((item, index) => {
                console.log(item.sell_price_min_date)
                let dt = new Date(`${item.sell_price_min_date}Z`)
                item.sell_price_min_date = dt.toLocaleString([], { 
                  year: "numeric",
                  month: "2-digit", 
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit"
                })
                item.id = index
                return item
              })
              console.log(this.fields)
            })
            .catch( error => {
                console.log('err', error);
            });
        }
    },
    created() {
        this.search();
    }
  }
</script>


<style scoped>
.select-width {
  width: 200px;
}

</style>
