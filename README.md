#说明
### 页面输入串号，然后跳到播放页面，播放页面调用中间件播放器。利用spring boot 实现，可以mvn install 打包成war，部署在tomcat下使用。
### index.html 加了跳转，解决相对路径问题，详细参见 index.html页面注释

#spring boot 部署为 war （Tomcat下使用）
jar to  war <br>

### 相关示例和链接
https://github.com/RawSanj/SOFRepos/tree/master/spring-boot-sample-tomcat-jsp （5*） <br>
https://github.com/cnliuy/SOFRepos/tree/master/spring-boot-sample-tomcat-jsp （5* ） 自存项目   好用 <br>
http://stackoverflow.com/questions/35938716/jsp-with-jstl-not-working-on-tomcat-8-in-a-spring-boot-application   （5*）

### 注意
如出现 org.apache.el.lang.ELSupport.coercetoType 和 <br>
This application has no explicit mapping for /error, so you are seeing this as a fallback. <br>
There was an unexpected error (type=Internal Server Error, status=500). <br>

类似问题，先考虑jsp文件保存时的格式问题 ，确保是 save as UTF-8 格式的，可以先去掉jsp页头的 <br>

     <%@ page language ="java" contentType="text/html; charset=UTF-8"  pageEncoding= "UTF-8"%> <!--去掉这一行
      然后保存为utf-8的jsp页面 ，后面可以再加上-->
     <!DOCTYPE html lang="utf-8" >
     。。。。
<br>