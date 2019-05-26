<template>
  <scroll
    class="suggest"
    :data="result"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    ref="suggest"
  >
    <ul class="suggest-list">
      <li
        class="suggest-item"
        v-for="item in result"
        :key="item.singerid ? item.singerid : item.songid"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import {search} from 'api/search'
import {ERR_OK} from 'api/config'
import {createSong} from 'common/js/song'
import {getSongVkey} from 'api/singer'
import Singer from 'common/js/singer'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {mapMutations, mapActions} from 'vuex'
import NoResult from 'base/no-result/no-result'

// const TYPE_SINGER = 'singer'
const PERPAGE = 20

export default {
  props: {
    query: {
      type: String,
      default: ''
    },
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      page: 1,
      result: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  methods: {
    search () {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          this.result = this._normalizeSongs(res.data)
          this._checkMore(res.data)
        }
      })
    },
    getIconCls (item) {
      if (item.avatar) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    },
    getDisplayName (item) {
      if (item.avatar) {
        return item.name
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    searchMore () {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.showSinger, PERPAGE).then((res) => {
        if (res.code === ERR_OK) {
          let oldResult = this.result.concat(this._normalizeSongs(res.data))
          setTimeout(() => {
            this.result =  [...this.result, ...oldResult]
          }, 400)
          this._checkMore(res.data)
        }
      })
    },
    selectItem (item) {
      if (item.avatar) {
        this.$router.push({
          path: `/search/${item.id}`
        })
        this.setSinger(item)
      } else {
        this.insertSong(item)
      }
      this.$emit('select')
    },
    refresh () {
      this.$refs.suggest.refresh()
    },
    listScroll () {
      this.$emit('listScroll')
    },
    _normalizeSongs (data) {
      let ret = []
      if (data.zhida && data.zhida.singerid) {
        ret.push(new Singer({
          name: data.zhida.singername,
          id: data.zhida.singermid
        }))
      }
      if (data.song) {
        let list = data.song.list
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            getSongVkey(musicData.songmid).then((res) => {
              if (res.code === ERR_OK) {
                const svkey = res.data.items
                const songVkey = svkey[0].vkey
                ret.push(createSong(musicData, songVkey))
              }
            })
          }
        })
      }
      return ret
    },
    _checkMore (data) {
      const song = data.song
      if (!song.list.length || (song.curnum + song.curpage * PERPAGE) >= song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  watch: {
    query (newQuery) {
      this.search(newQuery)
    }
  },
  computed: {
    delayShow () {
      setTimeout(() => {
        console.log(111)
        return !this.hasMore && !this.result.length
      }, 20)
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
