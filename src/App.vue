

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
        <select class="form-select" v-model="this.typeVal" @change="onSelectType" aria-label="纖維">
          <option selected>物品種類</option>
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
        <select class="form-select" v-model="this.levelVal" @change="onSelectType" aria-label="4">
          <option selected>物品階級</option>
          <option value="T1">1</option>
          <option value="T2">2</option>
          <option value="T3">3</option>
          <option value="T4">4</option>
          <option value="T5">5</option>
          <option value="T6">6</option>
          <option value="T7">7</option>
          <option value="T8">8</option>
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
      <tr v-for="row in rows" :key="row.sell_price_min_date">
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
export default {
    data() {
      return {
        fields: [
        ],
        typeVal: "FIBER",
        levelVal: "T4"
      }
    },
    methods: {
      onSelectType(event){
        console.log(this.typeVal)
        this.search()

      },
      search() {
            const self = this
            axios({
                method: 'get',
                url: `https://east.albion-online-data.com/api/v2/stats/prices/${this.levelVal}_${this.typeVal}`,
                headers: { 
                }
            })
            .then( data => {
              console.log(data)
              this.fields = data.data
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
</style>
