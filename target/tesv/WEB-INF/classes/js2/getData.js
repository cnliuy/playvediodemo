/**
 * 获取资讯类数据，包括获取栏目数据，文章数据，文章页码信息
 * 例：获取栏目数据
 		getData.getMenuData(function(_data){}, menuId, hasRoot);
 		//menuId,hasRoot可选，如果不指定menuId，则返回所有一级栏目和每一个一级栏目下包含的二级栏目的集合;如果指定了menuId，则返回该栏目下的子栏目集合;hasRoot 业务下面是否有跟目录

 	   获取文章数据
 	    getData.getArticleData(function(_data){}, menuId, curPage);//curPage可选
 	    
 	   获取文章页码信息
 	   getData.getPage(function(_data){}, menuId);
 * 
 *
 */
var getData = {
	rootData: null,
	menuJson: null,
	menuData: [],
	recData: [],
	articleJson: null,
	articleData: [],
	dataList: null,
	getMenuData: function(_callback, id, hasRoot) { // hasRoot 有值（true）：业务下面有跟目录   没有值（false）：则业务下直接是二级栏目
		var $this = this;
		var menuId = id; //指定栏目id
		var hasRoot = hasRoot || false;
		new Ajax("jsdata/channels.json", function(_data) {
			$this.dataList = _data.dataList;
			if (menuId) { //
				for (var i = 0; i < $this.dataList.length; i++) {
					if ($this.dataList[i].pd == menuId) {
						if ($this.dataList[i].cn == "跑马灯") {
							$this.recData = $this.dataList[i];
						}else if($this.dataList[i].cn == "广告1"){
							initAd1($this.dataList[i]);
						}else if($this.dataList[i].cn == "广告2"){
							initAd2($this.dataList[i]);
						}else if($this.dataList[i].cn == "广告3"){
							initAd3($this.dataList[i]);
						}else {
							$this.menuData.push($this.dataList[i]);
						}
					}
				}
			} else {
				if (hasRoot) { //如果业务下配置了根栏目,此时推荐的recData 为根数据
					for (var i = 0; i < $this.dataList.length; i++) { //获取指定根目录
						if ($this.dataList[i].pd == "") {
							$this.rootData = $this.dataList[i];
							break;
						}
					}
					//获取根目录下的栏目								
					for (var i = 0; i < $this.dataList.length; i++) {
						if ($this.dataList[i].pd == $this.rootData.id) {
							if ($this.dataList[i].cn == "跑马灯") {
								$this.recData = $this.dataList[i];
							}else if($this.dataList[i].cn == "广告1"){
								initAd1($this.dataList[i]);
							}else if($this.dataList[i].cn == "广告2"){
								initAd2($this.dataList[i]);
							}else if($this.dataList[i].cn == "广告3"){
								initAd3($this.dataList[i]);
							} else {
								$this.menuData.push($this.dataList[i]);
							}
						}
					}
					$this.recData = $this.rootData; //此时推荐的recData 为根数据
				} else {
					//没有根目录
					for (var i = 0; i < $this.dataList.length; i++) {
						if ($this.dataList[i].pd == "") {
							if ($this.dataList[i].cn == "跑马灯") {
								$this.recData = $this.dataList[i];
							}else if($this.dataList[i].cn == "广告1"){
								initAd1($this.dataList[i]);
							}else if($this.dataList[i].cn == "广告2"){
								initAd2($this.dataList[i]);
							}else if($this.dataList[i].cn == "广告3"){
								initAd3($this.dataList[i]);
							} else {
								$this.menuData.push($this.dataList[i]);
							}
						}
					}
				}
			}
			//如果获取到得栏目下面还有下一级子栏目
			for (var i = 0; i < $this.menuData.length; i++) {
				$this.menuData[i].subMenu = [];
				for (var j = 0; j < $this.dataList.length; j++) {
					if ($this.dataList[j].pd == $this.menuData[i].id) {
						$this.menuData[i].subMenu.push($this.dataList[j]);
					}
				}
			}
			_callback($this.menuData, $this.recData);
		});
	},
	getArticleData: function(_callback, _id, _curPage) { //获取文章数据
		var $this = this;
		var url = "";
		if (_curPage)
			url = "jsdata/articles_" + _id + "_" + _curPage + ".json";
		else
			url = "jsdata/articles_" + _id + ".json";
		new Ajax(url, function(_data) {
			$this.articleJson = null;
			$this.articleData = [];
			$this.articleData = _data.dataList;
			_callback($this.articleData, _id);
		});
	},
	getPage: function(_callback, _id) { //获取页码信息
		var url = "jsdata/articles_" + _id + "_page.json";
		new Ajax(url, function(_data) {
			var pageObj = _data;
			var totalPage = pageObj.pages;
			var totalData = pageObj.total;
			_callback(totalPage, totalData);
		});
	}
}