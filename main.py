import cgi
import os
import webapp2
from urlparse import parse_qs, urlsplit

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.api import urlfetch

class MainPage(webapp2.RequestHandler):
	def get(self):
		self.redirect("/static/index.html")

class 100Meters(webapp2.RequestHandler):
	def get(self):
		self.redirect("/static/100meters.html")

class Sudoku(webapp2.RequestHandler):
	def get(self):
		query_params = parse_qs(self.request.query_string)
		sudoku = urlfetch.fetch("http://www.dailysudoku.com/cgi-bin/sudoku/get_board.pl?year="+
				query_params["year"][0]+"&month="+query_params["month"][0]+"&day="+query_params["day"][0]+"&type=")
		self.response.out.write(sudoku.content)


application = webapp2.WSGIApplication(
	[
	('/', MainPage),
	('/sudoku', Sudoku),
	('/100meters.html', 100Meters),
	],
	debug=True)

def main():
	run_wsgi_app(application)

if __name__ == "__main__":
	main()
