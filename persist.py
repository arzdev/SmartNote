import os
import time
import subprocess
hostname = "smartnote.live"
cmd = "wget --server-response http://smartnote.live/up 2>&1 | awk \'/^  HTTP/{print $2}\' &" 


while(True):
	#response = os.system("wget --server-response http://smartnote.live/up 2>&1 | #awk \'/^  HTTP/{print $1}\'")
	try:
		response = int(subprocess.check_output(cmd, shell=True).split('\n')[0])
		print("our response is ", response, "and only that")
	except:
		print('got error')
		os.system("sudo lsof -i tcp:80")
		os.system("node server.js")
	time.sleep(10)


	"""
	#and then check the response...
	if response == 0:
	  print (hostname, 'is up!')
	else:
	  print (hostname, 'is down! putting back online!')
	"""
	  
