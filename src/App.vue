

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
        <select class="form-select select-width" v-model="this.classVal" @change="onSelectClass" aria-label="原生資源">
          <option v-for="item in optionsByItemClasses" :key="item" :value="item">{{item}}</option>
        </select>
        <select class="form-select select-width" v-model="this.typeVal" @change="onSelectType" aria-label="木材">
          <option v-for="item in optionsByItemType" :key="item" :value="item">{{item}}</option>
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
        <button type="button" class="btn btn-secondary" @click="this.onAdd">加入查詢</button>
      </ul>
    </div>
  </div>
</nav>
  </div>
  <div>
    <el-tag
      v-for="tag in tags"
      :key="tag.name"
      class="mx-1"
      closable
      effect="dark"
      @close="onRemoveTag(tag)"
      :type="tag.type"
    >
      {{ tag.name }}
    </el-tag>
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
        <td v-bind:style="{color: row.color}">{{ row.city }}</td>
        <td>{{ row.sell_price_min }}</td>
        <td>{{ row.sell_price_min_date }}</td>
      </tr>
    </template>
  </VTable>
</div>
</template>

<script>
import axios from 'axios';
import {itemTypeValues, optionsByItemClasses, optionsByItemType, itemClassValues} from './components/ItemValues.vue'
const color_map = {
  "BlackMarket": "#000000",
  "Bridgewatch": "#ffe2a0",
  "Caerleon": "#000000",
  "FortSterling": "#e1e1e1",
  "Lymhurst": "#82ed82",
  "Martlock": "#87cdf5",
  "Thetford": "#c882c8",
  "5003": "#000000"
}
export default {
    data() {
      var result = {};
      for(var key in itemTypeValues) {
        result[itemTypeValues[key]] = key;
      }
      return {
        fields: [
        ],
        type:"WOOD",
        typeVal: "木材",
        levelVal: "T4",
        enchantVal: "",
        tags:[
          { name: 'T4木材', type: 'info', value: 'T4_WOOD' },
        ],
        optionsByItemClasses: optionsByItemClasses['STUFF'],
        classVal: "原生資源",
        optionsByItemType: optionsByItemType['RAW'],
        itemTypeValuesCht: result,
        color_map :{
          "BlackMarket": "#000000",
          "Bridgewatch": "#e6a23c",
          "Caerleon": "#000000",
          "FortSterling": "#d1d1d1",
          "Lymhurst": "#82ed82",
          "Martlock": "#4062ff",
          "Thetford": "#c882c8",
          "5003": "#000000"
        }

      }
    },
    methods: {
      onAdd(){
        let isIn = false;
        let name = `${this.levelVal}${this.typeVal}${this.enchantVal}`

        this.tags.forEach((item) => {
          if (item.name === name){
            isIn = true
          }
        });
        if (!isIn){
          let params = `${this.levelVal}_${this.type}`
          if (this.enchantVal !== "" && this.enchantVal !== null){
              params = `${params}_${this.enchantVal}`
          }
          this.tags.push({ name: name, type: 'info', value: params })
          this.search()
        }
      },
      onSelectType(){
        this.type = itemTypeValues[this.typeVal]
        console.log(this.type)
      },
      onSelectClass(){
        this.optionsByItemType = optionsByItemType[itemClassValues[this.classVal]]

      },
      onRemoveTag(event){
        this.tags = this.tags.filter(tag => tag.name != event.name)
        console.log(this.tags)
        this.search()
      },
      search() {
            const self = this
            let params = []
            this.tags.forEach((item) => {
              params.push(item.value)
            });
            
            if (this.typeVal === "SKILLBOOK_STANDARD"){
              params = `T4_SKILLBOOK_STANDARD`
            }
            let url = `https://east.albion-online-data.com/api/v2/stats/prices/${params.join(',')}`
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
                let enName = item.item_id.split("_")[1]
                item.item_id = item.item_id.replace(enName, this.itemTypeValuesCht[enName])
                item.id = index
                item.color = "#000000"
                item.color = this.color_map[item.city.replace(" ", "")]
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
