
(function() {
    var gitProfile = {
        githubApiUrl: "https://api.github.com/users/",

        init: function() {
            this.cacheDom();
            this.bindEvents();
        },

        cacheDom: function() {
            this.$el = $(".search");
            this.inputForm = this.$el.find("#search-user");
            this.profile = this.$el.find("#profile");
        },

        bindEvents: function() {
            this.inputForm.on("keyup", this.getInput.bind(this));
        },

        getInput: function(e) {
            e.preventDefault();
            var inputVal = e.target.value;

            this.makeAjaxCall(inputVal);
        },

        makeAjaxCall: function(input) {
            var that = this;
            $.ajax({
                url: `${this.githubApiUrl}${input}`,
                data: {
                    client_id: "2d3f6b01a321be4d6ad2",
                    client_secret: "0571472ba82a4b6833005cead636d3a8c9fc972c"
                }
            }).done(function(user) {
                that.renderData(user);
                that.makeReposCall(input);
            });
        },

        makeReposCall: function(input) {
            console.log(input);
            var that = this;
            $.ajax({
                url: `${this.githubApiUrl}${input}/repos`,
                data: {
                    client_id: "2d3f6b01a321be4d6ad2",
                    client_secret: "0571472ba82a4b6833005cead636d3a8c9fc972c",
                    sort: "created: asc",
                    per_page: 5
                }
            }).done(function(repos) {
                that.renderRepos(repos);
            })
        },

        renderData: function(data) {

            this.profile.html(`
                <div class="panel panel-default">
                  <div class="panel-heading">
                    <h3 class="panel-title">${data.name}</h3>
                  </div>
                  <div class="panel-body">
                    <div class="row">
                        <div class="col-md-3">
                            <img class="thumbnail" src="${data.avatar_url}" alt="profile-image" />
                            <a class="btn btn-primary btn-block" href="${data.html_url}" target="_blank">View profile</a>
                        </div>
                        <div class="col-md-9">
                            <span class="label label-default">Public Repos: ${data.public_repos}</span>
                            <span class="label label-primary">Public Gists: ${data.public_gists}</span>
                            <span class="label label-success">Followers: ${data.followers}</span>
                            <span class="label label-info">Following: ${data.following}</span>
                            <br /><br />
                            <ul class="list-group">
                                <li class="list-group-item">Company: ${data.company}</li>
                                <li class="list-group-item">Website/Blog: ${data.blog}</li>
                                <li class="list-group-item">Location: ${data.location}</li>
                                <li class="list-group-item">Bio: ${data.bio}</li>
                                <li class="list-group-item">Member Since: ${data.created_at}</li>
                            </ul>
                        </div>
                    </div>
                  </div>
                </div>

                <h3 class="page-header">Latest Repos</h3>
                <div id="repos">

                </div>
            `);
        },

        renderRepos: function(datas) {
            var that = this;

            $.each(datas, function(index, data) {
                $("#repos").append(`
                    <div class="well">
                        <div class="row flex-container">
                            <div class="col-md-7">
                                <strong>${data.name}</strong>:  ${data.description}
                            </div>
                            <div class="col-md-3">
                                <span class="label label-default">Forks: ${data.forks_count}</span>
                                <span class="label label-primary">Watchers: ${data.watchers_count}</span>
                                <span class="label label-success">Stars: ${data.stargazer_count}</span>
                            </div>
                            <div class="col-md-2">
                                <a class="btn btn-default" href="${data.html_url}" target="_blank">Repo Page</a>
                            </div>
                        </div>
                    </div>
                `)
            });
        }
    }

    gitProfile.init();
})()
