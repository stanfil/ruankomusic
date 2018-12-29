#!/usr/bin/env python
# -*- coding:utf-8 -*-
import requests
import json
import re
from pymongo import MongoClient


conn = MongoClient('127.0.0.1', 27017)
db = conn.ruanko
mycol = db.Song

# class Song:
#     album=''
#     time_public=''
#     id=''
#     mid=''
#     title=''
#     singers=''
#     interval=''
#     img_url=''
#     type=''
#     lyr_url=''


def getSonglist(url):
    res = requests.get(url)
    res = json.loads(res.text)['new_song']["data"]["song_list"]
    return res


def getSonginfo(songlist):
    songinfo=[]
    i=1
    for item in songlist:
        info = {
            'album':item['album']['name'],
            'time_public':item['album']['time_public'],
            "id":str(item['id']),
            'mid':item['mid'],
            'title':item['name'],
            'interval':item['interval'],
            'singers':'',
            'img_url':'',
            'type':'',
            'lyric':''
        }

        #   跳过已下载
        isExist = mycol.find_one({'mid': info["mid"]})
        print(isExist)
        if isExist == None:
            info['singers']=doSingers(item['singer'])
            info['img_url']=getImgurl(info['mid'])
            info['type']=getType(info['mid'])
            info['lyric']=getLyric(info['id'], info['mid'])
            downloadSong(info['mid'])
            mycol.insert_one(info)
        print(str(i)+' done')
        i=i+1



        # # 测试
        # if i==2:
        #     break


def doSingers(singers):
    names = []
    for item in singers:
        names.append(item['name'])
    return names



def getImgurl(mid):
    url = 'https://y.qq.com/n/yqq/song/'+mid+'.html'
    res = requests.get(url).text
    imgurl = re.search(r'//(y.gtimg.cn/music/photo_new/.*?jpg\?max_age=2592000)', res).group(1)
    print(imgurl+'\n')
    return imgurl



def getType(mid):
    url = 'https://y.qq.com/n/yqq/song/'+mid+'.html'
    res = requests.get(url).text
    type = re.search(r'"genre":\{"title":"歌曲流派","type":"JUMP_TO_CATEGORY","content":\[\{"id":\d*?,"value":"(.*?)","mid"', res).group(1)
    print("类型： "+ type +'\n')
    return type



def getLyric(id, mid):
    url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_yqq.fcg?nobase64=1&musicid='+ id +'&-=jsonp1&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0'
    headers = {
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36",
        "referer" : "https://y.qq.com/n/yqq/song/"+ mid +".html"
    }
    res = requests.get(url=url, headers=headers)
    res = json.loads(res.text)
    if res["retcode"]==0:
        lyric = res['lyric']
        print(lyric[0:30]+'\n')
    else:
        lyric = ""
        print("暂无歌词")
    return lyric

def downloadSong(mid):
    url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?&jsonpCallback=MusicJsonCallback&cid=205361747&songmid='+ mid +'&filename=C400'+ mid +'.m4a&guid=7349446525'
    response = requests.get(url)    # 访问加密的网址
    response = json.loads(response.text)
    vkey = response['data']['items'][0]['vkey'] # 加密的参数
    music_url = 'http://dl.stream.qqmusic.qq.com/C400'+ mid +'.m4a?vkey='+ vkey +'&guid=7349446525&uin=0&fromtag=66'
    headers={
        "User-Agent" : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36"
    }
    response = requests.get(url=music_url, headers=headers, stream=True)
    with open('E:/Songs/'+ mid +'.m4a', 'wb') as f:
        for chunk in response.iter_content(1024):
            f.write(chunk)
    print('歌曲'+ mid +'下载完成\n')



################################# 主程序体 #############################

# 初始 URL
All = [
    # "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom7175946807122815&g_tk=5381&loginUin=352070351&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22new_song%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetNewSong%22%2C%22param%22%3A%7B%22type%22%3A1%7D%7D%7D",
    "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom3646067215171067&g_tk=5381&loginUin=352070351&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22new_song%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetNewSong%22%2C%22param%22%3A%7B%22type%22%3A2%7D%7D%7D",
    "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom9355211175683635&g_tk=5381&loginUin=352070351&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22new_song%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetNewSong%22%2C%22param%22%3A%7B%22type%22%3A3%7D%7D%7D",
    "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom4337431783460921&g_tk=5381&loginUin=352070351&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22new_song%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetNewSong%22%2C%22param%22%3A%7B%22type%22%3A4%7D%7D%7D",
    "https://u.y.qq.com/cgi-bin/musicu.fcg?-=recom23477228885343782&g_tk=5381&loginUin=352070351&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22new_song%22%3A%7B%22module%22%3A%22QQMusic.MusichallServer%22%2C%22method%22%3A%22GetNewSong%22%2C%22param%22%3A%7B%22type%22%3A5%7D%7D%7D"
]
for url in All:
    songlist = getSonglist(url)
    getSonginfo(songlist)
