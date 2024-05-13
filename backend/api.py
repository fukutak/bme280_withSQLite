from util.session_models import db_session
from flask import Flask
from flask_graphql import GraphQLView
from flask_cors import CORS
from util.queries import schema

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000', 'http://172.29.111.112:3000'])
# class MyGraphQLView(GraphQLView):
#     def options(self, *args, **kwargs):
#         return jsonify({
#             'methods': ['GET', 'POST', 'OPTIONS'],
#             'allowCredentials': True,
#         }), 200
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True, content_type='application/json')
)


@app.teardown_appcontext
def shutdown_session(exception=None):
    db_session.remove()


if __name__ == "__main__":
    app.run(threaded=True, debug=True)